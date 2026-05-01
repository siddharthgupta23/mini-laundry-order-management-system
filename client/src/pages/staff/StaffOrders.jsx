import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filter, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `/orders?page=1&limit=50`;
      if (filter) url += `&status=${filter}`;
      if (search) url += `&search=${search}`;
      
      const { data } = await axiosInstance.get(url);
      setOrders(data.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${id}/status`, { status: newStatus });
      toast.success("Status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage Orders</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by ID, name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        >
          <option value="">All Statuses</option>
          <option value="RECEIVED">Received</option>
          <option value="PROCESSING">Processing</option>
          <option value="READY">Ready</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Items</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-slate-400">{order.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-600">{order.garments.reduce((acc, curr) => acc + curr.quantity, 0)}</td>
                    <td className="p-4 text-sm text-slate-900 font-medium">₹{order.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-2 py-1 border rounded text-xs font-medium ${
                          order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          order.status === 'READY' ? 'bg-green-50 text-green-800 border-green-200' :
                          order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="RECEIVED">RECEIVED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="READY">READY</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffOrders;
