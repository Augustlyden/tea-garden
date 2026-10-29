import db from '../config/database';
import { ProductAttributes, ProductInstance } from '../types/productTypes';
import { formatProduct } from '../utils/productCartFormatter';
import { ValidProduct } from '../utils/productValidator';

class Product {
  private static readonly BASE_ADMIN_SELECT = `
    SELECT 
      p.product_name,
      p.id,
      p.price,
      p.category_id,
      p.in_stock,
      p.img_url,
      p.img_path,
      p.description,
      p.attributes,
      p.is_available,
      p.is_deleted,
      c.type AS type
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;

  private static readonly PLACEHOLDER_IMG_URL = '';
  static async create(productData: ProductAttributes): Promise<ProductInstance> {
    const result = await db.query(`
      INSERT INTO products
        (product_name, category_id, price, in_stock, img_url, description, attributes, is_available, img_path)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
          productData.imgPath
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

  static async findBySku(sku: string): Promise<number | null> {
    const result = await db.query(`
      SELECT p.id 
      FROM products p
      WHERE p.supplier_sku = $1;
      `, [sku]
    );

    const row = result.rows[0];
    if (!row) return null;
    return row.id;
  }

  static async upsertBySku(productData: ValidProduct, categoryId: number): Promise<ProductInstance> {
    const result = await db.query(`
      INSERT INTO products
        (supplier_sku, product_name, category_id, price, in_stock, description, attributes, img_url)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (supplier_sku) DO UPDATE SET
        product_name = EXCLUDED.product_name,
        category_id = EXCLUDED.category_id,
        price = EXCLUDED.price,
        in_stock = EXCLUDED.in_stock,
        description = EXCLUDED.description,
        attributes = EXCLUDED.attributes
      RETURNING *;
      `, [
        productData.sku,
        productData.productName,
        categoryId,
        productData.price,
        productData.inStock,
        productData.desc,
        productData.attributes,
        this.PLACEHOLDER_IMG_URL
      ]
    );

    const row = result.rows[0];
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
        is_available = COALESCE($8, is_available),
        img_path = COALESCE($9, img_path)
      WHERE id = $10
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
          productData.imgPath,
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