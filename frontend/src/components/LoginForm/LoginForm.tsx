"use client";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useAppDispatch } from '@/utils/redux/hooks';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/services/authSlice';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password_hash, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await dispatch(login({ email, password_hash})).unwrap();
      router.push("/");
    } catch (err: unknown) {
      let errorMsg = "Login failed. Please try again.";
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        errorMsg = (err as { message: string }).message;
      } else {
        errorMsg = JSON.stringify(err);
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex items-center rounded-md px-3 py-2 mb-4 border border-white/20 bg-transparent focus-within:ring-2 focus-within:ring-blue-400">
          <span className="mr-2"><FaUser size={20} color="#bfdbfe" /></span>
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent outline-none text-white placeholder-blue-200 flex-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="flex items-center rounded-md px-3 py-2 border border-white/20 bg-transparent focus-within:ring-2 focus-within:ring-blue-400">
          <span className="mr-2"><FaLock size={20} color="#bfdbfe" /></span>
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-white placeholder-blue-200 flex-1"
            value={password_hash}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center text-blue-100 text-sm select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="accent-blue-400 mr-2"
          />
          Remember me
        </label>
        <a href="#" className="text-blue-200 text-sm hover:underline">Forgot your password?</a>
      </div>
      {error && (
        <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-md shadow transition-colors mb-4 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Loading..." : "LOGIN"}
      </button>
      <div className="text-center text-blue-100 text-sm">
        New here? <a href="#" className="text-white font-semibold hover:underline">Sign Up</a>
      </div>
    </form>
  );
}
