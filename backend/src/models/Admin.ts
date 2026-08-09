import db from '../config/database';

interface AdminRow {
  id: number;
  username: string;
  password: string;
}

class Admin {
  static async findByUsername(username: string): Promise<AdminRow | undefined> {
    const result = await db.query(`
      SELECT * FROM admin WHERE username = $1
      `, [username]
    );
    return result.rows[0];
  }
}

export default Admin;