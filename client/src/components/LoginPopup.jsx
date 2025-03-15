import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CouponContext } from "../context/CouponContext";

const LoginPopup = ({ isOpen, onClose }) => {
  const { setToken } = useContext(CouponContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { username, password },
        { withCredentials: true } // ✅ Important: Allow cookies to be stored
      );
      setToken(res.data.token);
      onClose();
      setLoading(false);
      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div
        className={` fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg text-black">
            <h2 className="text-xl font-bold mb-4 text-center ">Admin Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded my-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded my-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mr-2"
              >
                Login
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default LoginPopup;
