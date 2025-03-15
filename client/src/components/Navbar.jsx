// Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="text-xl font-bold">
        Coupons
      </Link>
      <Link to="/admin" className="text-lg">
        Admin
      </Link>
    </nav>
  );
}
export default Navbar;
