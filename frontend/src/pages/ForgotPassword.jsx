import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthShell } from "./Login";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
      setLink(data.developmentResetUrl || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  }
  return (
    <AuthShell title="Reset your password" subtitle="Enter your account email.">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1"
          />
        </label>
        <button className="btn-primary w-full">Send Reset Request</button>
        {link && (
          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            Development reset link:{" "}
            <a className="break-all underline" href={link}>
              {link}
            </a>
          </div>
        )}
        <p className="text-center">
          <Link className="font-semibold text-indigo-600" to="/login">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
