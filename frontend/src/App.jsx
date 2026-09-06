import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Consultation from "./pages/Consultation";
import AdminConsultations from "./pages/AdminConsultations";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/consultation"
          element={<Consultation />}
        />

        <Route
          path="/admin/consultations"
          element={
              <ProtectedAdminRoute>
                  <AdminConsultations />
              </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
              <ProtectedAdminRoute>
                  <AdminProducts />
              </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;