import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAnalytics } from '../../services/adminService';

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const salesData = analytics?.monthlyRevenue || [];
  const productDistribution = analytics?.productDistribution || [];
  const topProducts = analytics?.topProducts || [];

  const COLORS = ['#8B1A1A', '#D4AF37', '#4CAF50', '#2196F3'];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getAnalytics(timeframe === 'all' ? 'all' : timeframe);
      if (res.success) {
        setAnalytics(res.analytics);
      } else {
        setAnalytics(null);
        console.error('Failed to load analytics:', res.error);
      }
      setLoading(false);
    };
    load();
  }, [timeframe]);

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
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">₱{(analytics?.orders?.total_revenue || 0).toLocaleString()}</p>
            <p className="text-green-500 text-sm mt-2">{analytics?.orders?.growthText || ''}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{analytics?.orders?.total_orders || 0}</p>
            <p className="text-green-500 text-sm mt-2">{analytics?.orders?.ordersGrowthText || ''}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-gray-800">₱{analytics?.orders && analytics.orders.total_orders ? Math.round((analytics.orders.total_revenue || 0) / analytics.orders.total_orders) : 0}</p>
            <p className="text-red-500 text-sm mt-2">{analytics?.orders?.aovChangeText || ''}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm mb-1">Customer Retention</p>
            <p className="text-3xl font-bold text-gray-800">{analytics?.customerRetention || 'N/A'}</p>
            <p className="text-green-500 text-sm mt-2">{analytics?.retentionChangeText || ''}</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div id="analytics-report">
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
                <Line yAxisId="right" type="monotone" dataKey="orderCount" stroke="#4CAF50" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Product Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={productDistribution.length ? productDistribution : (analytics?.topProducts || []).map(p => ({ name: p.name, value: p.totalSold }))}
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
                  {(productDistribution.length ? productDistribution : (analytics?.topProducts || []).map(p => ({ name: p.name, value: p.totalSold }))).map((entry, index) => (
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
              {(topProducts.length ? topProducts : []).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.totalSold || product.sales} kg sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">₱{(product.revenue || product.revenue === 0) ? Number(product.revenue).toLocaleString() : ''}</p>
                </div>
              ))}
              {(!topProducts || topProducts.length === 0) && !loading && (
                <p className="text-sm text-gray-500">No top products data available yet.</p>
              )}
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
                <Bar dataKey="totalSold" fill="#8B1A1A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <button onClick={async () => {
              try {
                const element = document.getElementById('analytics-report');
                if (!element) return;
                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'pt', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`analytics-report-${new Date().toISOString().slice(0,10)}.pdf`);
              } catch (err) {
                console.error('Export PDF error:', err);
              }
            }} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition flex items-center space-x-2">
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
