// import { useContext, useEffect, useState } from "react";
// import { CouponContext } from "../context/CouponContext";

// function Home() {
//   const { coupons, fetchCoupons, claimCoupon } = useContext(CouponContext);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const handleClaim = async (couponId) => {
//     const response = await claimCoupon(couponId);
//     setMessage(response.message);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Available Coupons</h1>
//       {message && (
//         <div className="bg-green-500 text-white p-2 mb-4">{message}</div>
//       )}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {coupons.map((coupon) => (
//           <div key={coupon._id} className="border p-4 rounded shadow">
//             <h2 className="text-lg font-semibold">{coupon.code}</h2>
//             <button
//               className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => handleClaim(coupon._id)}
//             >
//               Claim
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;

// Admin.jsx (Admin Panel)
// import { useContext, useEffect } from "react";
// import { CouponContext } from "../context/CouponContext";

// function Admin() {
//   const { coupons, fetchCoupons } = useContext(CouponContext);

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {coupons.map((coupon) => (
//           <div key={coupon._id} className="border p-4 rounded shadow">
//             <h2 className="text-lg font-semibold">{coupon.code}</h2>
//             <p>Status: {coupon.claimed ? "Claimed" : "Available"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Admin;
