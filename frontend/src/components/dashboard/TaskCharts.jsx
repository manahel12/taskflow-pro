import { BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

export default function TaskCharts({ data }) {
  const colors = ["#4f46e5","#f59e0b","#10b981","#ef4444","#06b6d4","#8b5cf6"];
  return <div className="grid gap-5 xl:grid-cols-2">
    <div className="card p-5"><h3 className="mb-4 font-bold dark:text-white">Tasks by Status</h3><div className="h-72"><ResponsiveContainer><BarChart data={data.status}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" fill="#4f46e5" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
    <div className="card p-5"><h3 className="mb-4 font-bold dark:text-white">Tasks by Priority</h3><div className="h-72"><ResponsiveContainer><PieChart><Pie data={data.priority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>{data.priority.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div></div>
    <div className="card p-5 xl:col-span-2"><h3 className="mb-4 font-bold dark:text-white">Tasks by Category</h3><div className="h-72"><ResponsiveContainer><BarChart data={data.categories}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" fill="#06b6d4" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
  </div>;
}
