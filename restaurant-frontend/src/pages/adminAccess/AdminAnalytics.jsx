import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, CreditCard, ShoppingBag, Calendar, Users, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [topItems, setTopItems] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  // Sample data structure based on your API responses
  const mockPaymentData = {
    totalDeposit: 17176,
    paymentBreakdown: [
      { _id: "QR", totalAmount: 4574 },
      { _id: "Cash", totalAmount: 4155 },
      { _id: "UPI", totalAmount: 1830 },
      { _id: "Card", totalAmount: 6617 }
    ]
  };

  const mockTopItems = [
    { _id: { week: 32, itemName: "CoderCamp" }, totalQty: 15 },
    { _id: { week: 32, itemName: "briyani" }, totalQty: 12 },
    { _id: { week: 32, itemName: "Margherita Pizza" }, totalQty: 6 }
  ];

  const mockStats = {
    totalOrders: 1247,
    totalRevenue: 17176,
    averageOrderValue: 138,
    totalCustomers: 892,
    growthRate: 12.5,
    orderGrowth: 8.3
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      setTimeout(() => {
        setStats(mockStats);
        setPaymentData(mockPaymentData);
        setTopItems(mockTopItems);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  // Transform data for charts
  const paymentChartData = paymentData?.paymentBreakdown.map(item => ({
    name: item._id,
    value: item.totalAmount,
    percentage: ((item.totalAmount / paymentData.totalDeposit) * 100).toFixed(1)
  })) || [];

  const topItemsChartData = topItems?.map(item => ({
    name: item._id.itemName,
    quantity: item.totalQty,
    week: item._id.week
  })) || [];

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, icon: Icon, change, changeType, prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      {change && (
        <div className="flex items-center mt-4">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor your business performance and key metrics</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue}
          icon={DollarSign}
          change={stats?.growthRate}
          changeType="positive"
          prefix="₹"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={ShoppingBag}
          change={stats?.orderGrowth}
          changeType="positive"
        />
        <StatCard
          title="Average Order Value"
          value={stats?.averageOrderValue}
          icon={TrendingUp}
          change={5.2}
          changeType="positive"
          prefix="₹"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers}
          icon={Users}
          change={15.3}
          changeType="positive"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <div className="text-sm text-gray-500">Total: ₹{paymentData?.totalDeposit.toLocaleString()}</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  labelFormatter={(label) => `${label} Payment`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {paymentChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name} ({entry.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Items</h3>
            <div className="text-sm text-gray-500">Week {topItems?.[0]?._id.week}</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Breakdown Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Method</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Share</th>
                </tr>
              </thead>
              <tbody>
                {paymentData?.paymentBreakdown.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        {item._id}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">₹{item.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {((item.totalAmount / paymentData.totalDeposit) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Items Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Item</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Week</th>
                </tr>
              </thead>
              <tbody>
                {topItems?.map((item, index) => (
                  <tr key={`${item._id.itemName}-${item._id.week}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        {item._id.itemName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{item.totalQty}</td>
                    <td className="py-3 px-4 text-right text-gray-600">W{item._id.week}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
      </AdminLayout>
  );
};

export default AdminAnalytics;