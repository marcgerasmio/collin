import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customers");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:1337/api/${role}?filters[email][$eq]=${email}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      if (data.data.length === 0) {
        setError("Wrong Credentials");
        return;
      }

      const user = data.data[0];
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      sessionStorage.setItem("user", JSON.stringify(user));

      if (role === "admins") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred while logging in.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-40 h-24" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <select
              id="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customers">Customer</option>
              <option value="admins">Admin</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm">
              Show Password
            </label>
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 focus:outline-none"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-500 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
