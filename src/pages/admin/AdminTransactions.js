import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const AdminTransactions = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    { 
      id: 'TXN-001', 
      orderId: 'ORD-001',
      customer: 'Juan Dela Cruz', 
      farmer: "Pedro's Farm",
      amount: 450, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-11-01',
      time: '10:30 AM'
    },
    { 
      id: 'TXN-002', 
      orderId: 'ORD-002',
      customer: 'Maria Santos', 
      farmer: 'Santos Farm',
      amount: 250, 
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryStatus: 'In Transit',
      date: '2024-11-02',
      time: '02:15 PM'
    },
    { 
      id: 'TXN-003', 
      orderId: 'ORD-003',
      customer: 'Pedro Garcia', 
      farmer: 'Garcia Farm',
      amount: 800, 
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      deliveryStatus: 'Processing',
      date: '2024-11-03',
      time: '09:45 AM'
    },
    { 
      id: 'TXN-004', 
      orderId: 'ORD-004',
      customer: 'Ana Lopez', 
      farmer: 'Lopez Farm',
      amount: 675, 
      paymentMethod: 'PayMaya',
      paymentStatus: 'Paid',
      deliveryStatus: 'Pending',
      date: '2024-11-04',
      time: '11:20 AM'
    },
    { 
      id: 'TXN-005', 
      orderId: 'ORD-005',
      customer: 'Carlos Reyes', 
      farmer: 'Reyes Farm',
      amount: 480, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-30',
      time: '03:00 PM'
    },
    { 
      id: 'TXN-006', 
      orderId: 'ORD-006',
      customer: 'Elena Cruz', 
      farmer: 'Cruz Farm',
      amount: 920, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-28',
      time: '01:45 PM'
    },
    { 
      id: 'TXN-007', 
      orderId: 'ORD-007',
      customer: 'Roberto Diaz', 
      farmer: 'Diaz Farm',
      amount: 340, 
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-27',
      time: '04:20 PM'
    },
    { 
      id: 'TXN-008', 
      orderId: 'ORD-008',
      customer: 'Sofia Mendez', 
      farmer: 'Mendoza Farm',
      amount: 1150, 
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-26',
      time: '10:00 AM'
    },
    { 
      id: 'TXN-009', 
      orderId: 'ORD-009',
      customer: 'Miguel Torres', 
      farmer: 'Torres Farm',
      amount: 560, 
      paymentMethod: 'PayMaya',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-25',
      time: '08:30 AM'
    },
    { 
      id: 'TXN-010', 
      orderId: 'ORD-010',
      customer: 'Isabel Ramos', 
      farmer: 'Santos Farm',
      amount: 780, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'In Transit',
      date: '2024-11-05',
      time: '02:50 PM'
    },
    { 
      id: 'TXN-011', 
      orderId: 'ORD-011',
      customer: 'Diego Fernandez', 
      farmer: 'Fernandez Farm',
      amount: 425, 
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryStatus: 'Processing',
      date: '2024-11-05',
      time: '11:15 AM'
    },
    { 
      id: 'TXN-012', 
      orderId: 'ORD-012',
      customer: 'Carmen Villanueva', 
      farmer: 'Villanueva Farm',
      amount: 890, 
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-24',
      time: '09:00 AM'
    },
    { 
      id: 'TXN-013', 
      orderId: 'ORD-013',
      customer: 'Luis Aquino', 
      farmer: 'Aquino Farm',
      amount: 650, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'Delivered',
      date: '2024-10-23',
      time: '03:30 PM'
    },
    { 
      id: 'TXN-014', 
      orderId: 'ORD-014',
      customer: 'Rosa Martinez', 
      farmer: 'Garcia Farm',
      amount: 510, 
      paymentMethod: 'PayMaya',
      paymentStatus: 'Paid',
      deliveryStatus: 'In Transit',
      date: '2024-11-05',
      time: '01:00 PM'
    },
    { 
      id: 'TXN-015', 
      orderId: 'ORD-015',
      customer: 'Fernando Silva', 
      farmer: 'Lopez Farm',
      amount: 975, 
      paymentMethod: 'GCash',
      paymentStatus: 'Paid',
      deliveryStatus: 'Processing',
      date: '2024-11-06',
      time: '10:45 AM'
    },
  ];

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === 'all' || txn.deliveryStatus.toLowerCase() === filter;
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transaction & Delivery Management</h1>
          <p className="text-gray-600">Monitor all transactions and delivery status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">₱{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Transit</p>
                <p className="text-3xl font-bold text-gray-800">
                  {transactions.filter(t => t.deliveryStatus === 'In Transit').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Delivered</p>
                <p className="text-3xl font-bold text-gray-800">
                  {transactions.filter(t => t.deliveryStatus === 'Delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by transaction ID, customer, or farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('delivered')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'delivered' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setFilter('in transit')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'in transit' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                In Transit
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{txn.orderId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{txn.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{txn.farmer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">₱{txn.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{txn.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(txn.paymentStatus)}`}>
                      {txn.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDeliveryStatusColor(txn.deliveryStatus)}`}>
                      {txn.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{txn.date}</div>
                    <div className="text-xs text-gray-500">{txn.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
