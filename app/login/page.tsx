"use client";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const doLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", form);

     
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");

      // Redirect to dashboard
      window.location.href = "/dashboard";

    } catch (error: any) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        className="mb-3 p-2 w-full"
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="mb-3 p-2 w-full"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        className="w-full bg-indigo-600 py-2 rounded"
        onClick={doLogin}
      >
        Login
      </button>

      {/* ⭐ Already have account / new account */}
      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-400 underline">Register</a>
      </p>
    </div>
  );
}
