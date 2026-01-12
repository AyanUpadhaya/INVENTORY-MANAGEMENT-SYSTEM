import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Users from "./pages/Users";
import AddProduct from "./pages/AddProduct";
import CustomerOrders from "./pages/CustomerOrders";
import PurchaseOrders from "./pages/PurchaseOrders";
import Settings from "./pages/Settings";
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import Customers from "./pages/Customers";
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

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
              <Route path="categories" element={<Categories />} />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="edit-category/:id" element={<EditCategory />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="warehouses" element={<Warehouses />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customer-orders" element={<CustomerOrders />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<h2>Not found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
