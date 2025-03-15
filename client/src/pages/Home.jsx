import { useState, useEffect, useContext } from "react";
import axios from "axios";
import LoginPopup from "../components/LoginPopup";
import { CouponContext } from "../context/CouponContext";
import { toast } from "react-toastify";

const Home = () => {
  const [coupon, setCoupon] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { token, logout } = useContext(CouponContext);

  useEffect(() => {
    // Fetch an unclaimed coupon for the user
    axios
      .get("http://localhost:5000/api/coupons/assign", {
        headers: { "X-Forwarded-For": "192.168.1.101" }, // Simulating different IPs
      })
      .then((res) => setCoupon(res.data.coupon))
      .catch((err) => console.error(err));
  }, []);

  const claimCoupon = async () => {
    try {
      const browserSession = localStorage.getItem("browserSession");

      const res = await axios.post(
        "http://localhost:5000/api/coupons/claim",
        { browserSession },
        {
          withCredentials: true, // Important for cookie handling
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setClaimed(true);
      setCoupon(res.data.coupon);
      toast.success(res.data.message);

      // Store the session ID if it's a new session
      if (!browserSession) {
        localStorage.setItem("browserSession", res.data.sessionId);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to claim coupon";
      toast.error(errorMessage);
      console.error("Error claiming coupon:", err);
    }
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-20 min-h-screen bg-gray-900 text-white">
      <div className="w-full flex gap-5 justify-end p-4">
        {token ? (
          <button onClick={logout} className="bg-blue-300 px-3 py-2 rounded-lg">
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-blue-300 px-3 py-2 rounded-lg"
          >
            Login
          </button>
        )}

        <LoginPopup
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-6">Claim Your Coupon</h1>
        {coupon ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl">Your Coupon Code:</p>
            <p className="text-2xl font-bold bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg">
              {coupon.code}
            </p>
            {!claimed ? (
              <button
                onClick={claimCoupon}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Claim Now
              </button>
            ) : (
              <p className="mt-4 text-green-400">
                Coupon claimed successfully!
              </p>
            )}
          </div>
        ) : (
          <p>Loading available coupons...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
