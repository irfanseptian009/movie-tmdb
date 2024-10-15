"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import axios from "../../../../utils/axiosClient";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Panggil API untuk registrasi
      await axios.post("/api/auth/register", { email, password });
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Registrasi gagal");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
      <p className="mt-4">
        Sudah punya akun? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
