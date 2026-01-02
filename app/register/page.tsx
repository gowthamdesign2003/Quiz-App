"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const doRegister = async () => {
    try {
      const res = await axios.post("/api/auth/register", form);
      if (res.status === 200) {
        alert("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Registration failed! Check details.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-gray-900 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-5 text-center">Create Account</h2>

      <input
        className="w-full mb-3 p-2 text-black rounded"
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full mb-3 p-2 text-black rounded"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="w-full mb-3 p-2 text-black rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        className="w-full bg-indigo-600 py-2 rounded mt-2"
        onClick={doRegister}
      >
        Register
      </button>

      {/* ⭐ Already have an account (Login link) */}
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 underline">
          Login
        </a>
      </p>
    </div>
  );
}
