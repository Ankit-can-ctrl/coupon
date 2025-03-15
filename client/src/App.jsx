import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { CouponProvider } from "./context/CouponContext";
import History from "./pages/History";
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <CouponProvider>
      <ToastContainer />
      <Router>
        <div className="min-h-screen bg-gray-100">
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
