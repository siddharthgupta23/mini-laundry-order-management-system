import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Package, Truck, Clock } from "lucide-react";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axiosInstance.get("/orders");
        const orders = data.data;
        
        let active = 0, delivered = 0;
        orders.forEach(order => {
          if (order.status === "DELIVERED") delivered++;
          else active++;
        });

        setStats({
          total: orders.length,
          active,
          delivered
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center p-8">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Orders</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
            <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Delivered</p>
            <p className="text-2xl font-bold text-slate-900">{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Items</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-600">{order.garments.reduce((acc, curr) => acc + curr.quantity, 0)} items</td>
                    <td className="p-4 text-sm text-slate-900">₹{order.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'READY' ? 'bg-green-100 text-green-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <p>You don't have any orders yet.</p>
              <Link to="/orders/new" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create an Order
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
