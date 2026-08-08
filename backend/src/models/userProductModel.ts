import db from '../config/database';
import { UserProductInstance } from '../types/productTypes';
import { formatUserProduct } from '../utils/productCartFormatter';

class Product {
  private static readonly BASE_USER_SELECT = `
    SELECT 
      p.product_name,
      p.id,
      p.price,
      p.category_id,
      p.in_stock,
      p.img_url,
      p.description,
      p.attributes,
      c.type AS type
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;

  static async findAllUser(): Promise<UserProductInstance[]> {
    const result = await db.query(`
      ${Product.BASE_USER_SELECT}
      WHERE p.is_deleted = false AND p.is_available = true
      ORDER BY p.product_name;
      `
    );

    const rows = result.rows;
    return rows.map(row => formatUserProduct(row));
  }

  static async findByIdUser(id: number): Promise<UserProductInstance | null> {
    const result = await db.query(`
      ${Product.BASE_USER_SELECT}
      WHERE p.id = $1 AND p.is_deleted = false AND p.is_available = true;
      `, [id]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatUserProduct(row);
  }
}

export default Product;