import { pool } from '../config/db.js';

async function setProductToPending() {
  try {
    console.log('Setting Sinandomeng product to pending status...\n');
    
    // Update the product with id that appears to be rejected
    const [result] = await pool.query(
      `UPDATE products SET status = 'pending' WHERE name LIKE '%Sinandomeng%' OR name LIKE '%sinandomeng%'`
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Successfully updated ${result.affectedRows} product(s) to pending status`);
      
      // Show updated products
      const [products] = await pool.query('SELECT id, name, status FROM products');
      console.log('\nCurrent products:');
      products.forEach(p => {
        console.log(`  - ${p.name}: ${p.status}`);
      });
    } else {
      console.log('❌ No products found to update');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setProductToPending();
