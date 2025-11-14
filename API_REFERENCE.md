# Ani2Table API Quick Reference

Base URL: `http://localhost:5000/api`

## Authentication
All protected routes require: `Authorization: Bearer <token>`

### Public Routes
```
POST /auth/register
Body: { username, password, email, firstName, lastName, middleName, birthday, gender, contactNumber, userType }

POST /auth/login
Body: { username, password }
Response: { success, token, user }
```

### Protected Routes
```
GET /auth/profile
Headers: Authorization: Bearer <token>

PUT /auth/profile
Headers: Authorization: Bearer <token>
Body: { firstName, lastName, middleName, birthday, gender, contactNumber, address, profileImage }
```

## Products

### Public
```
GET /products
Query: ?category=<category>&status=<status>&farmerId=<id>

GET /products/:id
```

### Farmer/Admin Only
```
POST /products
Body: { name, description, category, price, quantity, unit, imageUrl }

PUT /products/:id
Body: { name, description, category, price, quantity, unit, imageUrl, status }

DELETE /products/:id
```

## Shopping Cart (Consumer Only)

```
GET /cart

POST /cart
Body: { productId, quantity }

PUT /cart/:id
Body: { quantity }

DELETE /cart/:id

DELETE /cart  (clear all)
```

## Orders

### Consumer
```
POST /orders
Body: { paymentMethod, deliveryAddress, notes }
```

### All Authenticated Users
```
GET /orders  (filtered by role)

GET /orders/:id
```

### Farmer/Admin
```
PUT /orders/:id/status
Body: { status }  (pending|processing|shipped|delivered|cancelled)
```

### Admin Only
```
PUT /orders/:id/payment
Body: { paymentStatus }  (pending|paid|failed)
```

## Messages

```
GET /messages

POST /messages
Body: { receiverId, subject, message }

PUT /messages/:id/read

DELETE /messages/:id
```

## Admin (Admin Only)

```
GET /admin/analytics
Response: { users, products, orders, recentOrders, topProducts, monthlyRevenue }

GET /admin/transactions

GET /admin/users
Query: ?userType=<consumer|farmer|admin>
```

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error
```json
{
  "success": false,
  "error": "Error message"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Server Error

## Example Usage with Fetch

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'consumer', password: 'password' })
});
const data = await response.json();
const token = data.token;

// Get Products
const products = await fetch('http://localhost:5000/api/products');
const productData = await products.json();

// Add to Cart (with auth)
const cart = await fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ productId: 1, quantity: 2 })
});
```

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"consumer\",\"password\":\"password\"}"

# Get products
curl http://localhost:5000/api/products

# Create product (farmer)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d "{\"name\":\"Tomatoes\",\"price\":50,\"quantity\":100}"
```

## User Types and Permissions

### Consumer
- View products
- Manage cart
- Place orders
- View own orders
- Send/receive messages

### Farmer
- All Consumer permissions
- Create/edit/delete own products
- View orders containing their products
- Update order status

### Admin
- All permissions
- View all users, orders, products
- View analytics and transactions
- Update payment status
- Manage all resources
