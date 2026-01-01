"use client";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  const doRegister = async () => {
    await axios.post("/api/auth/register", form);
    alert("Account created!");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#1a1a1d] rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <input className="mb-3" placeholder="Name"     onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className="mb-3" placeholder="Email"    onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="mb-3" placeholder="Password" type="password"
             onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="w-full bg-indigo-600 py-2 rounded" onClick={doRegister}>Register</button>
    </div>
  );
}
