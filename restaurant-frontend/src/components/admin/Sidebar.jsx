// src/components/admin/Sidebar.jsx
import { FiShoppingBag, FiBox, FiList, FiDollarSign, FiPieChart, FiSettings, FiClipboard } from "react-icons/fi";
import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen shadow-md fixed">
      <div className="p-4 font-bold text-lg border-b">Unique R</div>
      <nav className="p-4 space-y-2">
        <NavItem icon={<FiShoppingBag />} to="/admin-dashboard">Dashboard</NavItem>
        <NavItem icon={<FiBox />} to="/admin-product-manager">Products</NavItem>
        {/* <NavItem icon={<FiList />} to="/admin-categories">Categories</NavItem> */}
        <NavItem icon={<FiDollarSign />} to="/admin-generate-bill">Create Bill</NavItem>
        <NavItem icon={<FiShoppingBag />} to="/admin-order-management">Orders</NavItem>
        <NavItem icon={<FiPieChart />} to="/admin-analytics">Analytics</NavItem>
        <NavItem icon={<FiClipboard  />} to="/admin-book-table">Book Tables </NavItem>
        <NavItem icon={<FiSettings />} to="/admin-settings">Settings</NavItem>
      </nav>
    </div>
  );
}
