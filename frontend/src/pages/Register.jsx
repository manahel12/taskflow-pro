import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "./Login";

export default function Register(){
 const [f,setF]=useState({name:"",email:"",password:""});const {saveAuth}=useAuth();const nav=useNavigate();
 async function submit(e){e.preventDefault();try{const {data}=await api.post("/auth/register",f);saveAuth(data);toast.success("Account created!");nav("/dashboard");}catch(err){toast.error(err.response?.data?.message||"Registration failed");}}
 return <AuthShell title="Create your account" subtitle="Start organizing your day with TaskFlow Pro."><form onSubmit={submit} className="space-y-4">
 {["name","email","password"].map(x=><label key={x} className="block text-sm font-semibold">{x[0].toUpperCase()+x.slice(1)}<input required type={x==="password"?"password":x==="email"?"email":"text"} minLength={x==="password"?6:undefined} value={f[x]} onChange={e=>setF({...f,[x]:e.target.value})} className="input mt-1"/></label>)}
 <button className="btn-primary w-full">Register</button><p className="text-center text-sm text-slate-500">Already have an account? <Link className="font-bold text-indigo-600" to="/login">Login</Link></p>
 </form></AuthShell>
}
