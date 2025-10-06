// OrderManagement

// OrderManagement
import  { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { FiPrinter, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { jsPDF } from "jspdf";

export default function OrderManagement() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingToday, setLoadingToday] = useState(false);

  // Fetch Pending / Failed Orders
  const fetchPendingOrders = async () => {
    setLoadingPending(true);
    try {
      const res = await fetch("http://localhost:8000/api/pending-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setPendingOrders(data.data);
      else alert(data.message || "Failed to fetch pending orders");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoadingPending(false);
  };

  // Fetch Today's Completed Orders
  const fetchTodayOrders = async () => {
    setLoadingToday(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin-today-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setTodayOrders(data.orders);
    } catch (err) {
      console.error(err);
    }
    setLoadingToday(false);
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch("http://localhost:8000/api/update-order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchPendingOrders();
        fetchTodayOrders();
      } else {
        alert(data.message || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Print Bill for Completed Orders
  const handlePrint = (order) => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("🧾 Unique R - Bill", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 10, y); y += 6;
    doc.text(`Customer: ${order.customerName}`, 10, y); y += 6;
    doc.text(`Phone: ${order.phone}`, 10, y); y += 10;

    doc.setFontSize(14);
    doc.text("Items:", 10, y); y += 8;

    order.items.forEach(item => {
      doc.text(`${item.name} × ${item.qty} - ₹${item.price * item.qty}`, 10, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(12);
    doc.text(`Total Amount: ₹${order.payment.amount}`, 10, y);

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  useEffect(() => {
    fetchPendingOrders();
    fetchTodayOrders();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <button 
            onClick={() => {
              fetchPendingOrders();
              fetchTodayOrders();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw className={`${loadingPending || loadingToday ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Pending / Failed Orders
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {pendingOrders.length} orders
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loadingPending ? (
              <div className="p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending orders found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingOrders.map(order => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-700">{order.orderId}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">{order.phone}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item.name} × {item.qty} <span className="text-gray-400">(₹{item.price})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-medium">₹{order.payment.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.payment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            onClick={() => updateOrderStatus(order.orderId, "completed")}
                          >
                            <FiCheckCircle size={14} />
                            Complete
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            onClick={() => updateOrderStatus(order.orderId, "cancelled")}
                          >
                            <FiXCircle size={14} />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Today's Completed Orders */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Today's Completed Orders
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {todayOrders.length} orders
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loadingToday ? (
              <div className="p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              </div>
            ) : todayOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No orders completed today.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {todayOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-700">{order.orderId}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">{order.phone}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600">
                              {item.name} × {item.qty}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-green-600">₹{order.payment.amount}</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handlePrint(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FiPrinter size={16} />
                            Print Bill
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}