import { FiAlertCircle, FiCheckCircle, FiClock, FiList, FiLoader } from "react-icons/fi";

const items = [
  ["Total Tasks", "total", FiList], ["Completed", "completed", FiCheckCircle],
  ["Pending", "pending", FiClock], ["In Progress", "inProgress", FiLoader], ["Overdue", "overdue", FiAlertCircle]
];

export default function StatsCards({ stats }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
    {items.map(([label, key, Icon]) => <div key={key} className="card p-5">
      <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><Icon className="text-indigo-600"/></div>
      <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{stats[key] ?? 0}</div>
    </div>)}
  </div>;
}
