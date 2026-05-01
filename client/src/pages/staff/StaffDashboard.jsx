import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";
import { Package, Clock, Settings, Truck } from "lucide-react";

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axiosInstance.get("/dashboard/stats");
      setStats(data.data);
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchStats();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
        <p className="text-slate-500">{new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Today's Orders</p>
          <p className="text-2xl font-bold text-slate-900">{stats.todayOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Received</p>
          <p className="text-2xl font-bold text-gray-700">{stats.ordersByStatus.RECEIVED || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.ordersByStatus.PROCESSING || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Ready</p>
          <p className="text-2xl font-bold text-green-600">{stats.ordersByStatus.READY || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Orders Needing Attention</h2>
          <Link to="/staff/orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Manage All Orders
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {stats.recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Items</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                    <td className="p-4 text-sm text-slate-600">{order.customerName}</td>
                    <td className="p-4 text-sm text-slate-600">{order.garments.reduce((acc, curr) => acc + curr.quantity, 0)} items</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'READY' ? 'bg-green-100 text-green-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === "RECEIVED" && (
                        <button 
                          onClick={() => updateStatus(order._id, "PROCESSING")}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-xs font-medium"
                        >
                          Start Processing
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button 
                          onClick={() => updateStatus(order._id, "READY")}
                          className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1 rounded text-xs font-medium"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === "READY" && (
                        <button 
                          onClick={() => updateStatus(order._id, "DELIVERED")}
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded text-xs font-medium"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No recent orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
