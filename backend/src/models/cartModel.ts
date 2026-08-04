import db from '../config/database';
import { CartInstance } from '../types/cartTypes';
import { formatCart } from '../utils/formatter';

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
}

export default Cart;