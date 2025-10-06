import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://7-eleven-backend.vercel.app/api/public/get-all-products"
        );
        setProducts(data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-600">
        Our Delicious Menu , "priduct will show here after Add" 
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Product Image */}
            <div className="w-full h-60 overflow-hidden">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {product.description || "No description available."}
              </p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-lg font-semibold text-green-600">
                  ₹{product.price}
                </span>
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
