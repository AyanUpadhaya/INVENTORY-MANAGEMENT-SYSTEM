import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import AddProduct from "./pages/AddProduct";
import { DashboardLayout } from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout></DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard">
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
            </Route>
          </Route>
          <Route path="*" element={<h2>Not found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
