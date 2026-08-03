import db from '../config/database';
import { CartInstance } from '../types/cartTypes';
import { formatCart } from '../utils/formatter';

class Cart {
  static async createOrUpdate(cartData: CartInstance): Promise<CartInstance> {
    const result = await db.query(`
        INSERT INTO cart (product_id, quantity, cart_token)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_id, cart_token)
        DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
        RETURNING *;
      `, [cartData.productId, cartData.quantity, cartData.cartToken]
    );

    const row = result.rows[0];
    return formatCart(row);
  }
}