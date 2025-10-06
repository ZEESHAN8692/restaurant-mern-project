import { useEffect, useState } from "react";
import axios from "axios";
import { FiPrinter } from "react-icons/fi";
import { jsPDF } from "jspdf";

export default function TodayOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://7-eleven-backend.vercel.app/api/admin-today-orders", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

    // Directly print without saving or redirect
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="text-center text-gray-500">No orders today.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Today's Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{order.customerName}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} × {item.qty}
                    </div>
                  ))}
                </td>
                <td className="p-3 font-semibold text-green-600">
                  ₹{order.payment.amount}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handlePrint(order)}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FiPrinter /> Print Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
