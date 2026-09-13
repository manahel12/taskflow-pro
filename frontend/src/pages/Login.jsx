import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveAuth(data);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your tasks.">
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <div className="text-right">
          <Link
            className="text-sm font-semibold text-indigo-600"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link className="font-bold text-indigo-600" to="/register">
            Register
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
function Field({ label, type, value, onChange }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1"
      />
    </label>
  );
}
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl dark:bg-slate-900">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 font-black text-white">
            TF
          </div>
          <h1 className="text-2xl font-black dark:text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
