// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FiDollarSign, FiList, FiUser, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import AdminLayout from "../../layouts/AdminLayout";


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("https://7-eleven-backend.vercel.app/api/admin_Dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen text-gray-600">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen text-red-500">
          Failed to load dashboard data.
        </div>
      </AdminLayout>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const paymentData = Object.entries(stats.paymentMethods || {}).map(([name, value]) => ({ name, value }));
  const monthlySalesData = (stats.monthlySales || []).map((m) => ({
    month: `${m._id.month}/${m._id.year}`,
    sales: m.totalSales,
  }));
  const topItems = stats.topItems || [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Sales" value={`₹${stats.totalSales || 0}`} change="+5%" changeType="up" icon={<FiDollarSign className="text-green-500" />} />
        <StatCard title="Today's Sales" value={`₹${stats.today?.sales || 0}`} change="+3%" changeType="up" icon={<FiDollarSign className="text-yellow-500" />} />
        <StatCard title="Bills Today" value={stats.today?.bills || 0} change="+1%" changeType="up" icon={<FiList className="text-blue-500" />} />
        <StatCard title="Customers Today" value={stats.today?.customers || 0} change="-1%" changeType="down" icon={<FiUser className="text-purple-500" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Monthly Sales">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Method Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Top Items This Week</h3>
        <ul className="space-y-2">
          {topItems.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item._id.itemName}</span>
              <span className="font-semibold">{item.totalQty}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, change, changeType, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-gray-50">{icon}</div>
    </div>
    <div className={`mt-4 flex items-center text-sm ${changeType === "up" ? "text-green-600" : "text-red-600"}`}>
      {changeType === "up" ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
      <span>{change} from last month</span>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    {children}
  </div>
);

export default AdminDashboard;
