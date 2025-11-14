// Test login functionality
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
  console.log('Testing login with consumer account...\n');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'consumer',
        password: 'password'
      }),
    });

    const data = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User:', data.user);
      
      // Test getting products
      console.log('\n\nTesting GET /api/products...');
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      console.log('Products:', JSON.stringify(productsData, null, 2));
    } else {
      console.log('\n❌ Login failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
