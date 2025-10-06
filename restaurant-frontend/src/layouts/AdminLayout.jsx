// src/layouts/AdminLayout.jsx
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}
