import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';

dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const sqlFile = path.resolve(process.cwd(), 'UPDATE_DATABASE.sql');

const run = async () => {
  try {
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split statements on semicolon while preserving IF NOT EXISTS and comments
    const statements = sql
      .split(/;\s*\n/) // split by semicolon+newline to avoid breaking inline semicolons
      .map(s => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      try {
        console.log('Running:', stmt.split('\n')[0].slice(0, 200));
        await pool.query(stmt);
      } catch (err) {
        // Log and continue - some statements may be selects or already applied
        console.error('Statement failed:', err.message);
      }
    }

    console.log('\nDone. Verify in your DB or restart the server.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

run();
