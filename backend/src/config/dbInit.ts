import fs from 'fs';
import path from 'path';
import { pool } from './database';

export const initDatabase = async (): Promise<void> => {
  try {
    const sqlFilePath = path.join(process.cwd(), 'sql', 'schema.sql');
    const sqlQueries = fs.readFileSync(sqlFilePath, 'utf-8');

    await pool.query(sqlQueries);
    console.log('Database tables verified/created successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    process.exit(1)
  }
}