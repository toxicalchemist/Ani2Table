import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/cartService';
import { createOrder } from '../../services/orderService';

const ConsumerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showNotification, setShowNotification] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const result = await getCart();
    if (result.success) {
      // Map API response to expected format
      const items = (result.cartItems || []).map(item => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit || 'kg',
        image: item.product.imageUrl,
        farmer: item.product.farmerName,
        selected: true
      }));
      setCartItems(items);
    } else {
      setToast({ message: result.error || 'Failed to load cart', type: 'error' });
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter(i => i.selected);

    if (selectedItems.length === 0) {
      setToast({ message: 'Please select at least one item to checkout', type: 'warning' });
      return;
    }

    setLoading(true);
    const orderData = {
      paymentMethod,
      deliveryAddress: 'Default Address', // You can add address input
      notes: '',
      selectedCartItemIds: selectedItems.map(i => i.id)
    };

    const result = await createOrder(orderData);
    if (result.success) {
      setShowNotification(true);
      setToast({ message: 'Order placed successfully! Your order is being processed.', type: 'success' });
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      await loadCart(); // Reload cart (should be empty after checkout)
    } else {
      // If server returned details about insufficient stock, show them clearly
      if (result.details && Array.isArray(result.details) && result.details.length > 0) {
        const msg = result.details.map(d => `${d.productName}: requested ${d.requested}kg, available ${d.available}kg`).join('; ');
        setToast({ message: `Cannot place order — insufficient stock: ${msg}`, type: 'error' });
      } else {
        setToast({ message: result.error || 'Failed to place order', type: 'error' });
      }
    }
    setLoading(false);
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      const result = await updateCartItem(cartItemId, newQuantity);
      if (result.success) {
        setToast({ message: 'Cart updated', type: 'info' });
        await loadCart();
      } else {
        setToast({ message: result.error || 'Failed to update cart', type: 'error' });
      }
    }
  };

  const removeItem = async (cartItemId) => {
    const item = cartItems.find(item => item.id === cartItemId);
    const result = await removeFromCart(cartItemId);
    if (result.success) {
      setToast({ message: `${item?.productName || 'Item'} removed from cart`, type: 'warning' });
      await loadCart();
    } else {
      setToast({ message: result.error || 'Failed to remove item', type: 'error' });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
        {/* Waiting for Approval Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-xl max-w-md animate-slide-in">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-green-800 text-lg mb-1">Order Placed Successfully!</h3>
                <p className="text-green-700">Your order is now waiting for farmer approval. You'll be notified once it's confirmed.</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-3 text-green-500 hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                  <a href="/consumer/products" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={!!item.selected}
                        onChange={(e) => {
                          const updated = cartItems.map(ci => ci.id === item.id ? { ...ci, selected: e.target.checked } : ci);
                          setCartItems(updated);
                          setSelectAll(updated.every(ci => ci.selected));
                        }}
                        className="w-5 h-5 mr-2"
                      />
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">by {item.farmer}</p>
                        <p className="text-lg font-bold text-primary mt-1">₱{item.price}/kg</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold">{item.quantity}kg</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">₱{item.price * item.quantity}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Select all checkbox */}
              {cartItems.length > 0 && (
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectAll(checked);
                        setCartItems(cartItems.map(ci => ({ ...ci, selected: checked })));
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Select all items</span>
                  </label>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'cash' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-bold text-gray-800">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'gcash' ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-bold text-gray-800">GCash</p>
                      <p className="text-sm text-gray-600">Digital payment</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                      G
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₱{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₱{deliveryFee}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₱{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                  cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                Proceed to Checkout
              </button>

              <a
                href="/consumer/products"
                className="block text-center text-primary font-bold hover:text-primary-dark mt-4"
              >
                Continue Shopping
              </a>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold mb-2">Have a promo code?</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                  <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ConsumerCart;
