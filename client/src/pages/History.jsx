import { useState, useEffect } from "react";
import axios from "axios";
import { CouponContext } from "../context/CouponContext";

const History = () => {
  const [history, setHistory] = useState([]);

  // Fetch claim history from backend
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/claims`,
        {
          withCredentials: true,
        }
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Claim History</h1>

      <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3">Coupon Code</th>
            <th className="p-3">IP Address</th>
            <th className="p-3">Browser Session</th>
            <th className="p-3">Claimed At</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 && (
            <tr>
              <td colSpan="4" className="p-3 text-center">
                No claims found.
              </td>
            </tr>
          )}
          {history.map((claim) => (
            <tr
              key={claim._id}
              className="border-b text-center border-gray-600"
            >
              <td className="p-3">{claim.couponId?.code || "N/A"}</td>
              <td className="p-3">{claim.ip}</td>
              <td className="p-3">{claim.browserSession}</td>
              <td className="p-3">
                {new Date(claim.claimedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
