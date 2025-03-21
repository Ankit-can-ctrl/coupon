import { createContext, useState } from "react";
import axios from "axios";

export const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
        {},
        { withCredentials: true }
      );

      setToken(null); // ✅ Update state to reflect logout
      window.location.href = "/"; // ✅ Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <CouponContext.Provider value={{ token, setToken, logout }}>
      {children}
    </CouponContext.Provider>
  );
};
