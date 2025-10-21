// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Import useAuth from AuthContext

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  //   const login = auth?.login;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    // console.log(email, password);
    try {
      const response = await fetch(
        "https://onapalbackend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data.token);
        auth?.login(data.token);
        // if (login) {
        //   login(data.token);
        // }
        setMessage(data.msg);
        setLoading(false);
        navigate(from, { replace: true });
      } else {
        setMessage(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error or server unavailable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-8">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-base"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className={`${loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-500"} w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200`}
            >
              Login
            </button>
          </div>
        </form>
        {message && (
          <p
            className={`mt-6 text-center text-base ${
              message.includes("success") ? "text-green-600" : "text-teal-600"
            }`}
          >
            {message}
          </p>
        )}
        {/* <p className="mt-8 text-center text-base text-gray-600">
          Don't have an admin account?{" "}
          <a
            href="/register"
            className="font-semibold text-orange-600 hover:text-orange-500 transition duration-200"
          >
            Register here
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default LoginPage;
