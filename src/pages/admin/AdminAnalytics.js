import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  const salesData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 170 },
    { month: 'May', revenue: 55000, orders: 155 },
    { month: 'Jun', revenue: 67000, orders: 185 },
    { month: 'Jul', revenue: 72000, orders: 195 },
    { month: 'Aug', revenue: 69000, orders: 180 },
    { month: 'Sep', revenue: 75000, orders: 200 },
    { month: 'Oct', revenue: 81000, orders: 215 },
    { month: 'Nov', revenue: 78000, orders: 205 },
    { month: 'Dec', revenue: 85000, orders: 225 },
  ];

  const productDistribution = [
    { name: 'Jasmine', value: 35 },
    { name: 'Sinandomeng', value: 30 },
    { name: 'Brown', value: 20 },
    { name: 'Specialty', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const topProducts = [
    { name: 'Jasmine Rice', sales: 450, revenue: 20250 },
    { name: 'Sinandomeng Rice', sales: 420, revenue: 16800 },
    { name: 'Brown Rice', sales: 300, revenue: 15000 },
    { name: 'Black Rice', sales: 180, revenue: 10800 },
    { name: 'Sticky Rice', sales: 150, revenue: 8250 },
    { name: 'Dinorado Rice', sales: 135, revenue: 7425 },
    { name: 'Red Rice', sales: 120, revenue: 7200 },
    { name: 'Organic White Rice', sales: 110, revenue: 5170 },
  ];

  const COLORS = ['#8B1A1A', '#D4AF37', '#4CAF50', '#2196F3'];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-semibold text-lg"
          >
            <option value="today">Today</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">₱328,000</p>
            <p className="text-green-500 text-sm mt-2">↑ 15.3% vs last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">905</p>
            <p className="text-green-500 text-sm mt-2">↑ 12.8% vs last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-gray-800">₱362</p>
            <p className="text-red-500 text-sm mt-2">↓ 2.1% vs last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Customer Retention</p>
            <p className="text-3xl font-bold text-gray-800">78%</p>
            <p className="text-green-500 text-sm mt-2">↑ 5.2% vs last period</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Revenue & Orders Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8B1A1A" strokeWidth={2} name="Revenue (₱)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#4CAF50" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Product Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={3}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} kg sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">₱{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Sales by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="sales" fill="#8B1A1A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
