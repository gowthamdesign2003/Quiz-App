"use client";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="text-center mt-20 text-white text-3xl">
      🎉 Dashboard - Authenticated User Area
    </div>
  );
}
