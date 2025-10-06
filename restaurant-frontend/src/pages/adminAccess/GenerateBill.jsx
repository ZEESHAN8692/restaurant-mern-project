import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiPrinter, FiUser, FiPhone, FiDollarSign } from "react-icons/fi";
import AdminLayout from "../../layouts/AdminLayout";

export default function GenerateBill() {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = "http://localhost:8000/api";

  // Fetch products
  useEffect(() => {
    fetch(`${BASE_URL}/get-all-products`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add product to bill
  const handleAddItem = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedItems((prev) => {
        const existingItem = prev.find((item) => item._id === productId);
        if (existingItem) {
          return prev.map(item =>
            item._id === productId ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
    }
  };

  // Change quantity
  const handleQtyChange = (index, qty) => {
    const updated = [...selectedItems];
    updated[index].qty = Math.max(1, parseInt(qty) || 1);
    setSelectedItems(updated);
  };

  // Remove item from bill
  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Total amount
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Generate bill & print
  const handleGenerateBill = () => {
    if (!customerName || selectedItems.length === 0) {
      alert("Please enter customer name and select products.");
      return;
    }

    const items = selectedItems.map(({ name, price, qty }) => ({
      name,
      price,
      qty
    }));

    fetch(`${BASE_URL}/generate-bill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        customerName,
        customerPhone,
        items,
        paymentMethod,
        totalAmount
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.bill) {
          printBill(data.bill);
          setSelectedItems([]);
          setCustomerName("");
          setCustomerPhone("");
        }
      })
      .catch((err) => console.error("Error generating bill:", err));
  };

  // Print function
  const printBill = (bill) => {
    const billHTML = `
      <div style="font-family: 'Courier New', monospace; width: 300px; padding: 15px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 15px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: bold;">My Shop</h2>
          <p style="margin: 5px 0; font-size: 12px;">123 Business Street, City</p>
          <p style="margin: 5px 0; font-size: 12px;">GSTIN: 22AAAAA0000A1Z5</p>
        </div>
        
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 10px 0;">
          <p style="margin: 3px 0; font-size: 13px;"><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleString()}</p>
          <p style="margin: 3px 0; font-size: 13px;"><strong>Bill No:</strong> ${bill.billNumber || 'N/A'}</p>
          <p style="margin: 3px 0; font-size: 13px;"><strong>Customer:</strong> ${bill.customerName}</p>
          <p style="margin: 3px 0; font-size: 13px;"><strong>Phone:</strong> ${bill.customerPhone || "N/A"}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px dashed #000; padding: 5px 0; font-size: 13px;">Item</th>
              <th style="text-align: right; border-bottom: 1px dashed #000; padding: 5px 0; font-size: 13px;">Price</th>
              <th style="text-align: right; border-bottom: 1px dashed #000; padding: 5px 0; font-size: 13px;">Qty</th>
              <th style="text-align: right; border-bottom: 1px dashed #000; padding: 5px 0; font-size: 13px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map(item => `
              <tr>
                <td style="padding: 5px 0; font-size: 13px;">${item.name}</td>
                <td style="text-align: right; padding: 5px 0; font-size: 13px;">₹${item.price}</td>
                <td style="text-align: right; padding: 5px 0; font-size: 13px;">${item.qty}</td>
                <td style="text-align: right; padding: 5px 0; font-size: 13px;">₹${item.price * item.qty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 10px 0;">
          <div style="display: flex; justify-content: space-between;">
            <p style="margin: 3px 0; font-size: 14px;"><strong>Subtotal:</strong></p>
            <p style="margin: 3px 0; font-size: 14px;">₹${bill.totalAmount}</p>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <p style="margin: 3px 0; font-size: 14px;"><strong>Payment Method:</strong></p>
            <p style="margin: 3px 0; font-size: 14px;">${bill.paymentMethod}</p>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <p style="margin: 3px 0; font-size: 16px; font-weight: bold;">Total:</p>
            <p style="margin: 3px 0; font-size: 16px; font-weight: bold;">₹${bill.totalAmount}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 15px;">
          <p style="margin: 5px 0; font-size: 12px;">Thank you for your purchase!</p>
          <p style="margin: 5px 0; font-size: 12px;">Please visit again</p>
        </div>
      </div>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Bill #${bill.billNumber || ''}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${billHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Generate Invoice</h1>
          
          {/* Customer Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiUser className="mr-2" /> Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Customer Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiDollarSign className="mr-2" /> Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card"> credit/Debit Card</option>
                    <option value="UPI">UPI Payment</option>
                    
                  </select>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Add Products</h2>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleAddItem(product._id)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 text-center truncate w-full">{product.name}</h3>
                  <p className="text-sm text-blue-600 font-bold mt-1">₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Items Table */}
          <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Selected Items</h2>
            {selectedItems.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center rounded-lg">
                <p className="text-gray-500">No items selected. Please add products to generate a bill.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.images?.[0]?.url ? (
                              <img className="h-10 w-10 rounded-md object-cover" src={item.images[0].url} alt={item.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category || 'No category'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                          className="w-16 text-right px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">Total</td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">₹{totalAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setSelectedItems([]);
                setCustomerName("");
                setCustomerPhone("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleGenerateBill}
              disabled={selectedItems.length === 0 || !customerName}
              className={`px-4 py-2 rounded-md text-white flex items-center ${selectedItems.length === 0 || !customerName ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <FiPrinter className="mr-2" /> Generate & Print Bill
            </button>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}