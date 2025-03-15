// AdminDashboard.jsx (Admin panel)
import { useContext, useEffect } from "react";
import { CouponContext } from "../context/CouponContext";

function AdminDashboard() {
  const { coupons, fetchCoupons } = useContext(CouponContext);

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{coupon.code}</h2>
            <p>Status: {coupon.claimed ? "Claimed" : "Available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
