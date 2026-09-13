import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const empty = { title:"", description:"", category:"Personal", priority:"Medium", status:"Pending", dueDate:"", notes:"" };

export default function TaskForm({ task, categories, onSubmit, onClose }) {
  const [form, setForm] = useState(empty);
  useEffect(() => {
    if (task) setForm({ ...empty, ...task, dueDate: task.dueDate ? task.dueDate.slice(0,10) : "", notes: task.notes?.join("\n") || "" });
    else setForm(empty);
  }, [task]);

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }
  function submit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      notes: form.notes ? form.notes.split("\n").filter(Boolean) : [],
      dueDate: form.dueDate || null
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{task ? "Edit Task" : "Create New Task"}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FiX/></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-semibold">Title<input name="title" required value={form.title} onChange={change} className="input mt-1"/></label>
          <label className="sm:col-span-2 text-sm font-semibold">Description<textarea name="description" value={form.description} onChange={change} rows="3" className="input mt-1"/></label>
          <label className="text-sm font-semibold">Category<select name="category" value={form.category} onChange={change} className="input mt-1">{categories.map(c => <option key={c._id}>{c.name}</option>)}</select></label>
          <label className="text-sm font-semibold">Priority<select name="priority" value={form.priority} onChange={change} className="input mt-1"><option>High</option><option>Medium</option><option>Low</option></select></label>
          <label className="text-sm font-semibold">Status<select name="status" value={form.status} onChange={change} className="input mt-1"><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <label className="text-sm font-semibold">Due Date<input type="date" name="dueDate" value={form.dueDate} onChange={change} className="input mt-1"/></label>
          <label className="sm:col-span-2 text-sm font-semibold">Notes<textarea name="notes" value={form.notes} onChange={change} rows="3" placeholder="One note per line" className="input mt-1"/></label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button className="btn-primary">{task ? "Save Changes" : "Create Task"}</button>
        </div>
      </form>
    </div>
  );
}
