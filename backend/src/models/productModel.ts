import db from '../config/database'
import { ProductAttributes, ProductDatabaseRow, ProductInstance } from '../types/productTypes'
import { formatProduct } from '../utils/productFormatter';

class Product {
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

    return formatProduct(row)
  }
}

export default Product