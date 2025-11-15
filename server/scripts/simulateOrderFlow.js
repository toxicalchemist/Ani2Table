let fetchFn;
// Use global fetch if available (Node 18+), otherwise dynamically import node-fetch
if (typeof fetch === 'function') {
  fetchFn = fetch;
} else {
  const mod = await import('node-fetch');
  fetchFn = mod.default;
}

const API = process.env.API_URL || 'http://localhost:5000/api';

async function login(username, password) {
  const res = await fetchFn(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

async function getProduct(id) {
  const res = await fetchFn(`${API}/products/${id}`);
  return res.json();
}

async function addToCart(token, productId, quantity) {
  const res = await fetchFn(`${API}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ productId, quantity })
  });
  return res.json();
}

async function createOrder(token) {
  const res = await fetchFn(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ paymentMethod: 'cash', deliveryAddress: 'Test address', notes: 'Sim test' })
  });
  return res.json();
}

async function updateOrderStatus(token, orderId, status) {
  const res = await fetchFn(`${API}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  return res.json();
}

async function run() {
  try {
    console.log('Logging in as consumer...');
    const consumerLogin = await login('consumer', 'password');
    if (!consumerLogin.success) throw new Error('Consumer login failed: ' + consumerLogin.error);
    const consumerToken = consumerLogin.token;

    console.log('Logging in as admin...');
    const adminLogin = await login('admin', 'password');
    if (!adminLogin.success) throw new Error('Admin login failed: ' + adminLogin.error);
    const adminToken = adminLogin.token;

    const productId = 1; // sample product

    console.log('Fetching product before actions...');
    console.log(await getProduct(productId));

    console.log('Adding product to cart (consumer)...');
    console.log(await addToCart(consumerToken, productId, 2));

    console.log('Creating order (consumer)...');
    const createRes = await createOrder(consumerToken);
    if (!createRes.success) throw new Error('Create order failed: ' + createRes.error);
    const orderId = createRes.orderId;
    console.log('Order created:', orderId);

    console.log('Fetching product after order creation...');
    console.log(await getProduct(productId));

    console.log('Marking order as delivered (admin)...');
    console.log(await updateOrderStatus(adminToken, orderId, 'delivered'));

    console.log('Fetching product after delivery (should have reduced stock)...');
    console.log(await getProduct(productId));

    console.log('Now cancelling the order (admin) to test restore...');
    console.log(await updateOrderStatus(adminToken, orderId, 'cancelled'));

    console.log('Fetching product after cancellation (should be restored)...');
    console.log(await getProduct(productId));

    console.log('\nSimulation complete.');
  } catch (err) {
    console.error('Simulation error:', err.message || err);
  }
}

run();
