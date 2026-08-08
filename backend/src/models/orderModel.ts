import db from '../config/database';
import { AdminOrderDetail, AdminOrderList, OrderInput, OrderInstance, StatusHistoryDatabaseRow } from '../types/orderTypes';
import { InsufficientStockError, NotFoundError } from '../utils/error';
import { formatOrder, formatOrderDetail, formatOrderList } from '../utils/orderFormatter';

class Order {
  private static readonly BASE_ORDER_SELECT = `
    SELECT 
      o.id,
      o.customer_name, 
      o.total_amount, 
      o.order_date,
      o.street,
      o.zip_code,
      o.city
    FROM orders o
  `;

  private static readonly BASE_STATUS_SELECT = `
    SELECT
      os.order_id, os.status, os.changed_at, a.username AS admin
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

       const stockUpdateResult = await client.query(`
        UPDATE products p
        SET in_stock = p.in_stock - c.quantity
        FROM cart c
        WHERE c.product_id = p.id 
          AND c.cart_token = $1
          AND p.in_stock >= c.quantity
        RETURNING p.id;
        `, [cartToken]
      );

      if (stockUpdateResult.rowCount !== productsResult.rows.length) {
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

  static async findAll(): Promise<AdminOrderList[]> {
    const status = await db.query(`
      ${this.BASE_STATUS_SELECT}
      ORDER BY os.order_id, os.changed_at ASC
      `
    );

    const orders = await db.query(`
      ${this.BASE_ORDER_SELECT}
      ORDER BY o.order_date DESC;
      `
    );

    const statusRows = status.rows;
    const orderData = orders.rows;

    const statusByOrderId = new Map<number, StatusHistoryDatabaseRow[]>();
    for (const row of statusRows) {
      const existing = statusByOrderId.get(row.order_id) ?? [];
      existing.push(row);
      statusByOrderId.set(row.order_id, existing);
    }

    return orderData.map(order =>
      formatOrderList(order, statusByOrderId.get(order.id) ?? [])
    );
  }

  static async findById(id: number): Promise<AdminOrderDetail | null> {
    const status = await db.query(`
      ${this.BASE_STATUS_SELECT}
      WHERE os.order_id = $1
      ORDER BY os.order_id, os.changed_at ASC;
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
}

export default Order;