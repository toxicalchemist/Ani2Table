import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', formData);
  };

  return (
    <div className="min-h-screen">
      <Navbar isLanding={true} />
      
      <div className="min-h-[calc(100vh-4rem)] relative bg-cover bg-center flex items-center justify-center" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1600)'
           }}>
        <div className="bg-primary/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">A</span>
            </div>
            <span className="font-bold text-2xl text-white">ANI2TABLE</span>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">Login to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-white hover:text-secondary">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-white mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-400 hover:text-green-300 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
