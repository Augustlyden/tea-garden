import db from '../config/database';
import { OrderAttributes, OrderInstance } from '../types/orderTypes';
import { InsufficientStockError, NotFoundError } from '../utils/error';
import { formatOrder } from '../utils/formatter';

class Order {
  static async create(cartToken: string, orderData: OrderAttributes): Promise<OrderInstance> {
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
}

export default Order;