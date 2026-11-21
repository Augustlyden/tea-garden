import db from '../config/database';

interface AdminRow {
  id: number;
  username: string;
  password: string | null;
  github_id: number | null;
}

interface GithubAdmin {
  id: number;
  username: string;
}

class Admin {
  static async findByUsername(username: string): Promise<AdminRow | undefined> {
    const result = await db.query(`
      SELECT * FROM admin WHERE username = $1
      `, [username]
    );
    return result.rows[0];
  }

  static async findOrCreateByGithub(githubId: number, login: string): Promise<GithubAdmin> {
    const result = await db.query(`
      INSERT INTO admin (github_id, username, password)
      VALUES ($1, $2, NULL)
      ON CONFLICT (github_id) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username;
      `, [githubId, login]
    );
    const row = result.rows[0];
    if (!row) throw new Error('Failed to create or find admin');
    return row;
  }
}

export default Admin;