import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/common/Loader";

export default function Categories(){
 const [cats,setCats]=useState([]),[name,setName]=useState(""),[loading,setLoading]=useState(true);
 async function load(){try{setCats((await api.get("/categories")).data)}catch(e){toast.error("Could not load categories")}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function add(e){e.preventDefault();try{await api.post("/categories",{name});setName("");toast.success("Category added");load()}catch(e){toast.error(e.response?.data?.message||"Could not add category")}}
 async function del(id){if(!confirm("Delete this custom category?"))return;try{await api.delete(`/categories/${id}`);toast.success("Deleted");load()}catch(e){toast.error(e.response?.data?.message||"Cannot delete category")}}
 return <div className="space-y-5"><div><p className="text-sm font-semibold text-indigo-600">Organization</p><h1 className="text-3xl font-black dark:text-white">Categories</h1></div><div className="card p-5"><form onSubmit={add} className="flex flex-col gap-3 sm:flex-row"><input required value={name} onChange={e=>setName(e.target.value)} placeholder="New category name" className="input"/><button className="btn-primary sm:w-40">Add Category</button></form></div>{loading?<Loader/>:<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cats.map(c=><div key={c._id} className="card flex items-center justify-between p-5"><div className="flex items-center gap-3"><span className="text-2xl">{c.icon}</span><div><div className="font-bold dark:text-white">{c.name}</div><div className="text-xs text-slate-500">{c.isDefault?"Default category":"Custom category"}</div></div></div>{!c.isDefault&&<button onClick={()=>del(c._id)} className="text-sm font-semibold text-red-600">Delete</button>}</div>)}</div>}</div>
}
