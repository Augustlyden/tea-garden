import db from '../config/database';
import { ProductAttributes, ProductInstance } from '../types/productTypes';
import { formatProduct } from '../utils/productCartFormatter';

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
      p.is_deleted,
      c.type AS type
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  static async create(productData: ProductAttributes): Promise<ProductInstance> {
    const result = await db.query(`
      INSERT INTO products
        (product_name, category_id, price, in_stock, img_url, description, attributes, is_available)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `, [
          productData.productName, 
          productData.categoryId, 
          productData.price, 
          productData.inStock,
          productData.imgUrl,
          productData.desc,
          productData.attributes,
          productData.isAvailable
        ]
    );

    const row = result.rows[0];
    return formatProduct(row);
  }

  static async findAllAdmin(): Promise<ProductInstance[]> {
    const result = await db.query(`
      ${this.BASE_ADMIN_SELECT}
      WHERE is_deleted = false
      ORDER BY p.product_name;
      `
    );

    const rows = result.rows;
    return rows.map(row => formatProduct(row));
  }

  static async findByIdAdmin(id: number): Promise<ProductInstance | null> {
    const result = await db.query(`
      ${this.BASE_ADMIN_SELECT}
      WHERE p.id = $1;
      `, [id]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatProduct(row);
  }

  static async update(id: number, productData: Partial<ProductAttributes>): Promise<ProductInstance | null> {
    const result = await db.query(`
      UPDATE products
      SET 
        product_name = COALESCE($1, product_name),
        category_id = COALESCE($2, category_id),
        price = COALESCE($3, price),
        in_stock = COALESCE($4, in_stock),
        img_url = COALESCE($5, img_url),
        description = COALESCE($6, description),
        attributes = COALESCE($7, attributes),
        is_available = COALESCE($8, is_available)
      WHERE id = $9
      RETURNING *;
      `, [
          productData.productName, 
          productData.categoryId, 
          productData.price, 
          productData.inStock,
          productData.imgUrl,
          productData.desc,
          productData.attributes,
          productData.isAvailable,
          id
        ]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatProduct(row)
  }

  static async delete(id: number): Promise<ProductInstance | null> {
    const result = await db.query(`
      UPDATE products
      SET 
        is_available = false,
        is_deleted = true 
      WHERE id = $1
      RETURNING *;
      `, [id]
    );

    const row = result.rows[0];
    if (!row) return null;
    return formatProduct(row);
  }
}

export default Product;