import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';

const ConsumerCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Jasmine Rice', price: 45, quantity: 10, farmer: "Pedro's Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
    { id: 2, name: 'Brown Rice', price: 50, quantity: 5, farmer: "Garcia Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
    { id: 3, name: 'Sinandomeng Rice', price: 40, quantity: 15, farmer: "Santos Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
  ]);

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showNotification, setShowNotification] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCheckout = () => {
    setShowNotification(true);
    setToast({ message: 'Order placed successfully! Your order is being processed.', type: 'success' });
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
      setToast({ message: 'Cart updated', type: 'info' });
    }
  };

  const removeItem = (id) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    setToast({ message: `${item.name} removed from cart`, type: 'warning' });
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
