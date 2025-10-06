import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiX, FiPlus, FiUpload } from "react-icons/fi";
import { lazy, Suspense } from "react";
import AdminLayout from "../../layouts/AdminLayout";

const BASE_URL = "http://localhost:8000/api/admin/product";

export default function ProductManager() {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: 0,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        setMessage({ text: data.message || "Failed to load products", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error fetching products", type: "error" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) || 0 : value
    }));
  };

  // Handle images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs and revoke old ones
    setPreviewImages(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return files.map(file => URL.createObjectURL(file));
    });
  };

  // Create or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });

      images.forEach((file) => {
        data.append("images", file);
      });

      const url = editingId
        ? `${BASE_URL}/products/${editingId}`
        : `${BASE_URL}/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ text: result.message, type: "success" });
        resetForm();
        fetchProducts();
        setShowModal(false);
      } else {
        setMessage({ text: result.message || "Action failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error submitting product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      stock: 0,
    });
    setImages([]);
    setPreviewImages([]);
    setEditingId(null);
  };

  // Open modal for editing or adding
  const openProductModal = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        stock: product.stock,
      });
      setPreviewImages(product.images.map(img => img.url));
    } else {
      resetForm();
    }
    setSelectedProduct(null);
    setShowModal(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    setSelectedProduct(products.find(p => p._id === id));
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products/${selectedProduct._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        setMessage({ text: result.message, type: "success" });
        fetchProducts();
      } else {
        setMessage({ text: result.message || "Failed to delete", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error deleting product", type: "error" });
    } finally {
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
            <button
              onClick={() => openProductModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiPlus /> Add Product
            </button>
          </div>

          {message.text && (
            <div className={`p-3 mb-6 rounded-lg ${message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
              }`}>
              {message.text}
            </div>
          )}

          {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found. Add your first product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <div
                key={product?._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  {product?.images?.[0]?.url ? (
                    <img
                      src={product?.images[0].url}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 font-bold mb-2">₹{product?.price}</p>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => openProductModal(product)}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingId ? "Update Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingId ? "Add More Images" : "Product Images"}
                    </label>
                    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <FiUpload className="text-gray-500 mb-2" size={24} />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        {editingId ? "Add additional images" : "Upload product images (multiple allowed)"}
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                  {previewImages.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Preview
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {previewImages.map((src, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={src}
                              alt="preview"
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : editingId ? (
                      <>
                        <FiEdit /> Update Product
                      </>
                    ) : (
                      <>
                        <FiPlus /> Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the product "{selectedProduct?.name}"?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}