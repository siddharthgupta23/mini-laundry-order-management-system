import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Users, 
  MessageSquare, 
  Settings 
} from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  const getNavLinks = () => {
    switch (user?.role) {
      case "admin":
        return [
          { to: "/admin/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
          { to: "/admin/orders", icon: <ShoppingBag />, label: "Manage Orders" },
          { to: "/admin/users", icon: <Users />, label: "Manage Users" },
          { to: "/admin/feedback", icon: <MessageSquare />, label: "View Feedback" },
        ];
      case "staff":
        return [
          { to: "/staff/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
          { to: "/staff/orders", icon: <ShoppingBag />, label: "Orders" },
        ];
      case "customer":
      default:
        return [
          { to: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
          { to: "/orders/new", icon: <PlusCircle />, label: "Create Order" },
          { to: "/orders", icon: <ShoppingBag />, label: "My Orders" },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="w-64 bg-slate-900 min-h-[calc(100vh-4rem)] text-slate-300 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <p className="text-sm font-semibold uppercase text-slate-500 tracking-wider">
          {user?.role} Portal
        </p>
        <p className="text-white truncate mt-1 font-medium">{user?.name}</p>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="[&>svg]:w-5 [&>svg]:h-5">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
