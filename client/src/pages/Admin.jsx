import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CouponContext } from "../context/CouponContext";

const Admin = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [updatedCode, setUpdatedCode] = useState("");
  const { logout } = useContext(CouponContext);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/coupons", {
        withCredentials: true,
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
        { code: newCoupon.toUpperCase() },
        { withCredentials: true }
      );
      setNewCoupon("");
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/coupons/toggle/${id}`,
        {},
        { withCredentials: true }
      );
      fetchCoupons();
    } catch (error) {
      console.error(
        "Error toggling coupon status:",
        error.response?.data || error.message
      );
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/coupons/delete/${id}`, {
        withCredentials: true,
      });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCoupon = async (id) => {
    if (!updatedCode.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/coupons/update/${id}`,
        { code: updatedCode.toUpperCase() },
        { withCredentials: true }
      );
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard - Coupons</h1>
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
              <td className="p-3">
                {editingCoupon === coupon._id ? (
                  <input
                    type="text"
                    className="p-2 text-black rounded"
                    value={updatedCode}
                    onChange={(e) => setUpdatedCode(e.target.value)}
                  />
                ) : (
                  coupon.code
                )}
              </td>
              <td className="p-3">
                {coupon.isActive
                  ? coupon.claimed
                    ? "Claimed"
                    : "Active"
                  : "Disabled"}
              </td>
              <td className="p-3 flex space-x-2">
                {!coupon.claimed && (
                  <button
                    onClick={() => toggleCouponStatus(coupon._id)}
                    className={`px-3 py-1 rounded ${
                      coupon.isActive ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {coupon.isActive ? "Disable" : "Enable"}
                  </button>
                )}
                {editingCoupon === coupon._id ? (
                  <button
                    onClick={() => updateCoupon(coupon._id)}
                    className="bg-blue-500 px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCoupon(coupon._id);
                      setUpdatedCode(coupon.code);
                    }}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Update
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
