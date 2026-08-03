import db from '../config/database';
import { ProductInstance } from '../types/productTypes';
import { formatProduct } from '../utils/productFormatter';

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

  static async findAllUser(): Promise<ProductInstance[]> {
    const result = await db.query(`
      ${Product.BASE_USER_SELECT}
      WHERE is_deleted = false AND is_available = true
      ORDER BY p.product_name;
      `
    );

    const rows = result.rows;
    return rows.map(row => formatProduct(row));
  }

  static async findByIdUser(id: number): Promise<ProductInstance | null> {
    const result = await db.query(`
      ${Product.BASE_USER_SELECT}
      WHERE p.id = $1;
      `, [id]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatProduct(row);
  }
}

export default Product;