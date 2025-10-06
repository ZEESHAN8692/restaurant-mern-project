
import { Link, useLocation } from "react-router-dom";

export default function NavItem({ icon, to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center p-2 rounded-md transition-colors ${
        isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
      }`}
    >
      <span className="text-xl mr-3">{icon}</span>
      {children}
    </Link>
  );
}
