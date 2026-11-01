import db from '../config/database';
import { CartInstance, CartWithProduct } from '../types/cartTypes';
import { formatCart, formatProductCart } from '../utils/productCartFormatter';

class Cart {
  static async createOrUpdate(cartData: CartInstance): Promise<CartInstance> {
    const result = await db.query(`
        INSERT INTO cart (product_id, quantity, cart_token)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_id, cart_token)
        DO UPDATE SET quantity = cart.quantity + 1
        RETURNING *;
      `, [cartData.productId, cartData.quantity, cartData.cartToken]
    );

    const row = result.rows[0];
    return formatCart(row);
  }

  static async decrease(id: number, cartToken: string): Promise<CartInstance | null> {
    const result = await db.query(`
      UPDATE cart
      SET quantity = quantity - 1
      WHERE id = $1 AND cart_token = $2 AND quantity > 1
      RETURNING *;
      `, [id, cartToken]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatCart(row);
  }

  static async findByCartToken(cartToken:string): Promise<CartWithProduct[]> {
    const result = await db.query(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.cart_token,
        p.product_name,
        p.price,
        p.price * c.quantity AS sub_total,
        p.img_url,
        p.is_deleted,
        p.is_available
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.cart_token = $1
      ORDER BY c.id;
      `, [cartToken]
    );

    const rows = result.rows;
    return rows.map(row => formatProductCart(row));
  }

  static async findByProductAndToken(
    productId: number, cartToken: string
  ): Promise<CartInstance | null> {
    const result = await db.query(`
      SELECT * FROM cart
      WHERE product_id = $1 AND cart_token = $2;
      `, [productId, cartToken]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatCart(row);
  }

  static async delete(id: number, cartToken: string): Promise<CartInstance | null> {
    const result = await db.query(`
      DELETE FROM cart WHERE id = $1 AND cart_token = $2
      RETURNING *;
      `, [id, cartToken]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatCart(row);
  }

  static async getGoodsTotal(cartToken: string): Promise<number> {
    const result = await db.query(`
      SELECT COALESCE(SUM(p.price * c.quantity), 0) AS total
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.cart_token = $1;
      `, [cartToken]
    );
    return Number(result.rows[0].total);
  }
}

export default Cart;