import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/coupons");
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  };

  const claimCoupon = async (couponId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/claim", {
        couponId,
      });
      fetchCoupons();
      return response.data;
    } catch (error) {
      console.error("Error claiming coupon", error);
      return { message: "Error claiming coupon" };
    }
  };

  return (
    <CouponContext.Provider value={{ coupons, fetchCoupons, claimCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};
