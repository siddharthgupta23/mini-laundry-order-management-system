import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";
import { Shield, ShieldOff, UserCheck, UserX } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await axiosInstance.patch(`/users/${id}/role`, { role });
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.patch(`/users/${id}/status`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-semibold text-slate-600">Name / Email</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Phone</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
                  <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{user.phone}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className={`px-2 py-1 border rounded text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          user.role === 'staff' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleStatus(user._id, user.isActive)}
                        className={`p-2 rounded transition-colors ${
                          user.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
