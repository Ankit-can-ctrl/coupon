// CouponCard.jsx (Displays a single coupon)
function CouponCard({ coupon, onClaim }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{coupon.code}</h2>
      <ClaimButton onClick={() => onClaim(coupon._id)} />
    </div>
  );
}

export default CouponCard;
