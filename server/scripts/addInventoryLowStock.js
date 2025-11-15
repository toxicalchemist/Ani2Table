import { pool } from '../config/db.js';

async function columnExists(table, column) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].cnt > 0;
}

async function apply() {
  try {
    console.log('Applying migration: add is_low_stock and inventory_adjusted columns (safe)');

    const prodHas = await columnExists('products', 'is_low_stock');
    if (!prodHas) {
      await pool.query(`ALTER TABLE products ADD COLUMN is_low_stock TINYINT(1) DEFAULT 0`);
      console.log('Added products.is_low_stock');
    } else {
      console.log('products.is_low_stock already exists, skipping');
    }

    const ordersHas = await columnExists('orders', 'inventory_adjusted');
    if (!ordersHas) {
      await pool.query(`ALTER TABLE orders ADD COLUMN inventory_adjusted TINYINT(1) DEFAULT 0`);
      console.log('Added orders.inventory_adjusted');
    } else {
      console.log('orders.inventory_adjusted already exists, skipping');
    }

    console.log('✅ Migration completed.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

apply();
