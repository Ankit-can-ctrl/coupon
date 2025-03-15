// ClaimButton.jsx (Handles claiming logic)
function ClaimButton({ onClick }) {
  return (
    <button
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      Claim
    </button>
  );
}

export default ClaimButton;
