import db from '../config/database';

interface UserRow {
  id: number;
  email: string;
  name: string;
}

class User { 
  static async findOrCreateByGoogle({ sub, email, name }: { sub: string; email: string; name: string }): Promise<UserRow> {
    const result = await db.query(`
      INSERT INTO customers (sub, email, name)
      VALUES ($1, $2, $3)
      ON CONFLICT (sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
      RETURNING id, name, email;
      `, [sub, email, name]
    );
    const row = result.rows[0];
    if (!row) throw new Error('Failed to create or find user');
    return row;
  }
}

export default User;