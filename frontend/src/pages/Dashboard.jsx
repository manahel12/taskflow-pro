import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/common/Loader";
import StatsCards from "../components/dashboard/StatsCards";
import TaskCharts from "../components/dashboard/TaskCharts";
import { useAuth } from "../context/AuthContext";

export default function Dashboard(){
 const {user}=useAuth();const [loading,setLoading]=useState(true);const [stats,setStats]=useState({});const [chart,setChart]=useState({status:[],priority:[],categories:[]});const [upcoming,setUpcoming]=useState([]);
 useEffect(()=>{Promise.all([api.get("/dashboard/stats"),api.get("/dashboard/chart"),api.get("/dashboard/upcoming")]).then(([a,b,c])=>{setStats(a.data);setChart(b.data);setUpcoming(c.data)}).catch(e=>toast.error(e.response?.data?.message||"Could not load dashboard")).finally(()=>setLoading(false));},[]);
 if(loading)return <Loader/>;
 return <div className="space-y-6"><div><p className="text-sm font-semibold text-indigo-600">Overview</p><h1 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">Good day, {user?.name} 👋</h1><p className="mt-1 text-slate-500">Here is your productivity snapshot.</p></div><StatsCards stats={stats}/><TaskCharts data={chart}/><div className="card p-5"><h2 className="font-extrabold text-slate-900 dark:text-white">Upcoming Tasks</h2>{upcoming.length?<div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">{upcoming.map(t=><div key={t._id} className="flex items-center justify-between py-3"><div><div className="font-semibold dark:text-white">{t.title}</div><div className="text-xs text-slate-500">{t.category} · {t.priority}</div></div><div className="text-xs font-semibold text-slate-500">{t.dueDate?format(new Date(t.dueDate),"dd MMM yyyy"):"No date"}</div></div>)}</div>:<p className="mt-4 text-sm text-slate-500">No upcoming tasks in the next 7 days.</p>}</div></div>
}
