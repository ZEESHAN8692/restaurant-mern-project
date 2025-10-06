import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(email, password);

    if (res.success) {
      toast.success(res.message || "Login successful!");
      navigate("/admin-dashboard"); // always redirect here
    } else {
      setError(res.message || "Login failed");
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className="flex justify-center items-center h-screen bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-80"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <motion.button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 w-full rounded hover:bg-yellow-600 transition"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AdminLogin;

