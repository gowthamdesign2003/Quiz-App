"use client";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [data, setData] = useState({ email:"", password:"" });

  const doLogin = async () => {
    const res = await axios.post("/api/auth/login", data);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#1a1a1d] rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input className="mb-3" placeholder="Email" onChange={e=>setData({...data,email:e.target.value})}/>
      <input className="mb-3" placeholder="Password" type="password"
             onChange={e=>setData({...data,password:e.target.value})}/>
      <button className="w-full bg-indigo-600 py-2 rounded" onClick={doLogin}>Login</button>
    </div>
  );
}
