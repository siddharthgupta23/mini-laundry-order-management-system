import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./src/context/AuthContext";
import { Toaster } from "react-hot-toast";

// Public Pages
import HomePage from "./src/pages/public/HomePage";
import ContactPage from "./src/pages/public/ContactPage";
import FeedbackPage from "./src/pages/public/FeedbackPage";

// Auth Pages
import LoginPage from "./src/pages/auth/LoginPage";
import RegisterPage from "./src/pages/auth/RegisterPage";

// Layouts & Routing
import DashboardLayout from "./src/components/DashboardLayout";
import { ProtectedRoute, RoleRoute } from "./src/components/ProtectedRoute";

// Customer Pages
import CustomerDashboard from "./src/pages/customer/CustomerDashboard";
import CreateOrder from "./src/pages/customer/CreateOrder";
import MyOrders from "./src/pages/customer/MyOrders";

// Staff Pages
import StaffDashboard from "./src/pages/staff/StaffDashboard";
import StaffOrders from "./src/pages/staff/StaffOrders";

// Admin Pages
import AdminDashboard from "./src/pages/admin/AdminDashboard";
import ManageOrders from "./src/pages/admin/ManageOrders";
import ManageUsers from "./src/pages/admin/ManageUsers";
import ViewFeedback from "./src/pages/admin/ViewFeedback";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col">
              <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
              <p className="text-slate-600">You do not have permission to access this page.</p>
            </div>
          } />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              
              {/* Customer Routes */}
              <Route element={<RoleRoute allowedRoles={["customer"]} />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/orders/new" element={<CreateOrder />} />
                <Route path="/orders" element={<MyOrders />} />
              </Route>

              {/* Staff Routes */}
              <Route element={<RoleRoute allowedRoles={["staff"]} />}>
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/orders" element={<StaffOrders />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<ManageOrders />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/feedback" element={<ViewFeedback />} />
              </Route>

            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
