import { format } from "date-fns";
import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";

const statusStyle = {
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  "In Progress": "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
};

const priorityStyle = {
  High: "text-red-600", Medium: "text-amber-600", Low: "text-emerald-600"
};

export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className={`font-bold text-slate-900 dark:text-white ${task.status === "Completed" ? "line-through opacity-60" : ""}`}>{task.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description || "No description provided."}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit(task)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><FiEdit2/></button>
          <button onClick={() => onDelete(task._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><FiTrash2/></button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{task.category}</span>
        <span className={`px-2 py-1 ${priorityStyle[task.priority]}`}>● {task.priority}</span>
        <select value={task.status} onChange={e => onStatus(task._id, e.target.value)} className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${statusStyle[task.status]}`}>
          <option>Pending</option><option>In Progress</option><option>Completed</option>
        </select>
      </div>
      {task.dueDate && <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><FiCalendar/> Due {format(new Date(task.dueDate), "dd MMM yyyy")}</div>}
    </div>
  );
}
