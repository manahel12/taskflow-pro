import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthShell } from "./Login";

export default function ResetPassword(){const {token}=useParams();const [password,setPassword]=useState("");const nav=useNavigate();async function submit(e){e.preventDefault();try{await api.put(`/auth/reset-password/${token}`,{password});toast.success("Password reset successfully");nav("/login");}catch(err){toast.error(err.response?.data?.message||"Reset failed");}}return <AuthShell title="Set new password" subtitle="Choose a new password."><form onSubmit={submit} className="space-y-4"><input required minLength="6" type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} className="input"/><button className="btn-primary w-full">Reset Password</button></form></AuthShell>}
