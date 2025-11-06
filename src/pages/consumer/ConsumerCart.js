import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const ConsumerCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Jasmine Rice', price: 45, quantity: 10, farmer: "Pedro's Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
    { id: 2, name: 'Brown Rice', price: 50, quantity: 5, farmer: "Garcia Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
    { id: 3, name: 'Sinandomeng Rice', price: 40, quantity: 15, farmer: "Santos Farm", image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 p-8">
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
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₱{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₱{deliveryFee}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₱{total}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-lg font-bold transition ${
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
      </div>
    </div>
  );
};

export default ConsumerCart;
