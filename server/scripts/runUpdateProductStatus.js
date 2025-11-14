import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateProductStatusColumn() {
  try {
    console.log('Updating products table status column...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'updateProductStatus.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.toLowerCase().includes('use ani2table')) {
        await pool.query(statement);
        console.log('✓ Database selected');
      } else if (statement.toLowerCase().includes('alter table')) {
        await pool.query(statement);
        console.log('✓ Products table status column updated');
      } else if (statement.toLowerCase().includes('select')) {
        const [result] = await pool.query(statement);
        console.log('✓', result[0]?.message || 'Success');
      }
    }
    
    console.log('\n✅ Database update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    process.exit(1);
  }
}

updateProductStatusColumn();
