import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { CouponProvider } from "./context/CouponContext";
import History from "./pages/History";

export default function App() {
  return (
    <CouponProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Router>
    </CouponProvider>
  );
}
