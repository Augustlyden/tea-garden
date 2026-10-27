import db from '../config/database';
import { 
  AdminOrderDetail, 
  OrderInput, 
  OrderInstance, 
  OrderSummary, 
  StatusHistoryItem, 
  StatusUpdateResult 
} from '../types/orderTypes';
import { InsufficientStockError, NotFoundError } from '../utils/error';
import { 
  formatOrder, 
  formatOrderDetail, 
  formatStatusUpdate, 
  mapStatusRows, 
  orderSummary 
} from '../utils/orderFormatter';

class Order {
  private static readonly BASE_ORDER_SELECT = `
    SELECT 
      o.id,
      o.customer_name, 
      o.total_amount, 
      o.order_date,
      o.street,
      o.zip_code,
      o.city,
      os.current_status
    FROM orders o
    LEFT JOIN (
        SELECT DISTINCT ON (order_id) order_id, status AS current_status
        FROM order_status
        ORDER BY order_id, changed_at DESC
      ) os ON os.order_id = o.id
  `;

  private static readonly BASE_STATUS_SELECT = `
    SELECT
      os.id, os.order_id, os.status, os.changed_at, a.username AS admin
    FROM order_status os
    LEFT JOIN admin a ON os.admin_id = a.id
  `;
  
  static async create(cartToken: string, orderData: OrderInput): Promise<OrderInstance> {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(`
        INSERT INTO orders
          (customer_name, street, zip_code, city, total_amount)
        SELECT
          $1, $2, $3, $4, SUM(p.price * c.quantity)
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.cart_token = $5
        GROUP BY c.cart_token
        RETURNING *;
        `, [
            orderData.customerName, 
            orderData.street,
            orderData.zipCode,
            orderData.city,
            cartToken
          ]
      );

      if (orderResult.rows.length === 0) {
        throw new NotFoundError('Cart is empty or cart_token is invalid');
      }

      const orderId = orderResult.rows[0].id;

      await client.query(`
        INSERT INTO order_product 
          (order_id, product_id, quantity, price)
        SELECT 
          $1, c.product_id, c.quantity, p.price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.cart_token = $2;
        `, [
          orderId,
          cartToken
        ]
      );

      await client.query(`
        INSERT INTO order_status (order_id)
        VALUES ($1); 
        `, [orderId]
      );

      const productsResult = await client.query(`
        SELECT c.product_id, c.quantity, p.price, p.product_name, p.img_url
        FROM cart c
        JOIN products p ON product_id = p.id
        WHERE c.cart_token = $1;
        `, [cartToken]
      );

       const lowStockResult = await client.query(`
        SELECT p.product_name
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.cart_token = $1 AND p.in_stock < c.quantity
        `, [cartToken]
      );

      if (lowStockResult.rows.length > 0) {
        throw new InsufficientStockError('Insufficient stock');
      }

      await client.query(`
        DELETE FROM cart WHERE cart_token = $1;
        `, [cartToken]
      );

      await client.query('COMMIT');

      const orderRow = orderResult.rows[0];
      const productRows = productsResult.rows;

      return formatOrder(orderRow, productRows);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findAll(): Promise<OrderSummary[]> {
    const result = await db.query(`
      ${this.BASE_ORDER_SELECT}
      ORDER BY o.order_date DESC;
      `
    );

    const rows = result.rows;
    return rows.map(orderSummary);
  }

  static async findHistoryByOrderId(id: number): Promise<StatusHistoryItem[]> {
    const result = await db.query(`
      ${this.BASE_STATUS_SELECT}
      WHERE os.order_id = $1;
      `, [id]
    );

    const rows = result.rows;
    return mapStatusRows(rows);
  }

  static async findById(id: number): Promise<AdminOrderDetail | null> {
    const status = await db.query(`
      ${this.BASE_STATUS_SELECT}
      WHERE os.order_id = $1
      ORDER BY os.order_id, os.changed_at DESC;
      `, [id]
    );

    const orders = await db.query(`
      ${this.BASE_ORDER_SELECT}
      WHERE o.id = $1;
      `, [id]
    );

    const products = await db.query(`
      SELECT 
        p.id AS product_id,
        p.product_name,
        p.img_url,
        op.quantity,
        op.price
      FROM order_product op
      JOIN products p ON op.product_id = p.id
      WHERE op.order_id = $1
      `, [id]
    );

    const orderData = orders.rows[0];
    if (!orderData) return null;
    const productRows = products.rows;
    const statusRows = status.rows;

    return formatOrderDetail(orderData, productRows, statusRows);
  }

  static async update(orderId: number, status: string, adminId: number): Promise<StatusUpdateResult> {
    const result = await db.query(`
      INSERT INTO order_status (order_id, status, admin_id)
      VALUES ($1, $2, $3)
      RETURNING *; 
      `, [orderId, status, adminId]
    );

    const row = result.rows[0];
    return formatStatusUpdate(row);
  }

  static async setStripeSessionId(orderId: number, sessionId: string): Promise<void> {
    const result = await db.query(`
      UPDATE orders 
      SET stripe_session_id = $1 
      WHERE id = $2;
      `, [sessionId, orderId]
    );

    if (!result.rowCount) {
      throw new Error('Order not found');
    }
  }

  static async markPaid(orderId: number): Promise<boolean> {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const payment = await client.query(`
        UPDATE orders
        SET payment_status = 'Betald' 
        WHERE id = $1 AND payment_status = 'Väntande'
        RETURNING id;
        `, [orderId]
      );

      if (!payment.rowCount) {
        await client.query('ROLLBACK');
        return false;
      }

      await client.query(`
        UPDATE products p
        SET in_stock = p.in_stock - op.quantity
        FROM order_product op
        WHERE op.order_id = $1 AND op.product_id = p.id;
        `, [orderId]
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async markCancelled(orderId: number): Promise<void> {
    await db.query(`
      UPDATE orders SET payment_status = 'Avbruten'
      WHERE id = $1 AND payment_status = 'Väntande';
      `, [orderId]
    );
  }

  static async findByStripeSessionId(sessionId: string): Promise<OrderInstance | null> {
    const orderResult = await db.query(`
      SELECT * FROM orders WHERE stripe_session_id = $1;
      `, [sessionId]
    );

    const orderRow = orderResult.rows[0];

    if (!orderRow) {
      return null;
    }

    const productsResult = await db.query(`
      SELECT 
        p.id AS product_id,
        p.product_name,
        p.img_url,
        op.quantity,
        op.price
      FROM order_product op
      JOIN products p ON p.id = op.product_id
      WHERE op.order_id = $1;
      `, [orderRow.id]
    );

    const productRows = productsResult.rows;
    return formatOrder(orderRow, productRows);
  }
}

export default Order;