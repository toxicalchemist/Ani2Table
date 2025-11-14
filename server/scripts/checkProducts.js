import { pool } from '../config/db.js';

async function checkProducts() {
  try {
    console.log('Checking products in database...\n');
    
    const [products] = await pool.query('SELECT id, name, status, farmer_id FROM products ORDER BY id');
    
    if (products.length === 0) {
      console.log('❌ No products found in database');
    } else {
      console.log(`✅ Found ${products.length} products:\n`);
      products.forEach(p => {
        console.log(`ID: ${p.id} | Name: ${p.name} | Status: ${p.status} | Farmer ID: ${p.farmer_id}`);
      });
    }
    
    console.log('\n--- Status Summary ---');
    const [statusCount] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM products 
      GROUP BY status
    `);
    
    statusCount.forEach(s => {
      console.log(`${s.status}: ${s.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
