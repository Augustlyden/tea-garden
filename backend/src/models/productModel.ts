import db from '../config/database'
import { ProductAttributes, ProductDatabaseRow, ProductInstance } from '../types/productTypes'
import { formatProduct } from '../utils/productFormatter';

class Product {
  private static readonly BASE_ADMIN_SELECT = `
    SELECT 
      p.product_name,
      p.id,
      p.price,
      p.category_id,
      p.in_stock,
      p.img_url,
      p.description,
      p.attributes,
      p.is_available,
      c.type AS type
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `
  static async create(productData: ProductAttributes): Promise<ProductInstance> {
    const result = await db.query(`
      INSERT INTO products
        (product_name, category_id, price, in_stock, img_url, description, attributes)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `, [
          productData.productName, 
          productData.categoryId, 
          productData.price, 
          productData.inStock,
          productData.imgUrl,
          productData.desc,
          productData.attributes
        ]
    );

    const row = result.rows[0];
    return formatProduct(row);
  }

  static async findAllAdmin(): Promise<ProductInstance[]> {
    const result = await db.query(`
      ${Product.BASE_ADMIN_SELECT}
      ORDER BY p.product_name;
      `
    );

    const rows = result.rows;
    return rows.map(row => formatProduct(row));
  }

  static async findByIdAdmin(id: number): Promise<ProductInstance | null> {
    const result = await db.query(`
      ${Product.BASE_ADMIN_SELECT}
      WHERE p.id = $1;
      `, [id]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatProduct(row);
  }
}

export default Product