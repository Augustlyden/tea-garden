import db from '../config/database';
import { CategoryInstance } from '../types/productTypes';

class Category {
  static async findAllCategories(): Promise<CategoryInstance[]> {
    const result = await db.query(`
      SELECT id, type FROM categories
      ORDER BY type;
      `
    );
    return result.rows;
  }
}

export default Category;