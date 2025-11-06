import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthday: '',
    gender: '',
    contactNumber: '',
    email: '',
    username: '',
    password: '',
    userType: 'consumer'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', formData);
  };

  return (
    <div className="min-h-screen">
      <Navbar isLanding={true} />
      
      <div className="min-h-[calc(100vh-4rem)] relative bg-cover bg-center flex items-center justify-center py-8" 
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1600)'
           }}>
        <div className="bg-primary/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-4">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">A</span>
            </div>
            <span className="font-bold text-2xl text-white">ANI2TABLE</span>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-6">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  placeholder="First name"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  placeholder="Middle name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  placeholder="Last name"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                placeholder="Choose a username"
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
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Account Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-500"
                required
              >
                <option value="consumer">Consumer</option>
                <option value="farmer">Farmer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition mt-6"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-white mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
