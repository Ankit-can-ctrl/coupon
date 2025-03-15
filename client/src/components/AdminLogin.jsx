// AdminLogin.jsx (Login form for admin)
function AdminLogin() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-full"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}

export default AdminLogin;
