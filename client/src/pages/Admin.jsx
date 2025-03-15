import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CouponContext } from "../context/CouponContext";

const Admin = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const { logout } = useContext(CouponContext);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/coupons", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const addCoupon = async () => {
    if (!newCoupon.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/coupons/add",
        { code: newCoupon },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewCoupon("");
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCoupon = async (id, update) => {
    try {
      await axios.put(`http://localhost:5000/api/coupons/${id}`, update, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard - Coupons</h1>
        <button className="bg-blue-300 px-3 py-2 rounded-lg" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Add New Coupon */}
      <div className="mb-4 flex">
        <input
          type="text"
          className="p-2 rounded text-black"
          placeholder="Enter coupon code"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
        />
        <button
          onClick={addCoupon}
          className="ml-2 bg-green-500 px-4 py-2 rounded"
        >
          Add Coupon
        </button>
      </div>

      {/* Coupon Table */}
      <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3">Code</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id} className="border-b border-gray-600">
              <td className="p-3">{coupon.code}</td>
              <td className="p-3">
                {coupon.expired
                  ? "Expired"
                  : coupon.claimed
                  ? "Claimed"
                  : "Active"}
              </td>
              <td className="p-3 flex space-x-2">
                {!coupon.claimed && (
                  <button
                    onClick={() => updateCoupon(coupon._id, { expired: true })}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Expire
                  </button>
                )}
                <button
                  onClick={() => deleteCoupon(coupon._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
