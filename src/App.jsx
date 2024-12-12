import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import PurchaseHistory from "./components/PurchaseHistory";
import Products from "./components/Products";
import AdminDashboard from "./components/AdminDashboard";
import MultipleItems from "./components/MultipleItems";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<PurchaseHistory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/multiple-details" element={<MultipleItems />} />
      </Routes>
    </>
  );
}
