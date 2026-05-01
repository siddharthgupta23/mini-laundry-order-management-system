import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const styles = {
    RECEIVED: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    READY: "bg-green-100 text-green-800",
    DELIVERED: "bg-emerald-100 text-emerald-800"
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter ? `/orders?status=${filter}` : "/orders";
      const { data } = await axiosInstance.get(url);
      setOrders(data.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetails = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/orders/${id}`);
      setSelectedOrder(data.data);
    } catch (error) {
      toast.error("Failed to load order details");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">All Orders</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
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
                {orders.map(order => (
                  <tr 
                    key={order._id} 
                    onClick={() => openOrderDetails(order._id)}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="p-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-slate-600">{order.garments.reduce((acc, curr) => acc + curr.quantity, 0)} items</td>
                    <td className="p-4 text-sm text-slate-900 font-medium">₹{order.totalAmount}</td>
                    <td className="p-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            No orders found.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Order Details: {selectedOrder.orderId}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Date Placed</p>
                  <p className="font-medium text-slate-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Est. Delivery</p>
                  <p className="font-medium text-slate-900">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Current Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-slate-500">Total Amount</p>
                  <p className="font-medium text-slate-900">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 border-b pb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.garments.map((g, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{g.quantity}x {g.type} (@ ₹{g.pricePerItem})</span>
                      <span className="font-medium">₹{g.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 border-b pb-2">Tracking History</h3>
                <div className="space-y-4">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {i !== selectedOrder.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm text-slate-900">{h.status}</p>
                        <p className="text-xs text-slate-500">{new Date(h.updatedAt).toLocaleString()}</p>
                        <p className="text-sm text-slate-600 mt-1">{h.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
