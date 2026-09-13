import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Loader from "../components/common/Loader";

export default function Tasks() {
  const [tasks, setTasks] = useState([]),
    [categories, setCategories] = useState([]),
    [loading, setLoading] = useState(true),
    [modal, setModal] = useState(false),
    [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    priority: "All",
    status: "All",
  });
  async function load() {
    try {
      setLoading(true);
      const q = new URLSearchParams(filters);
      const [a, b] = await Promise.all([
        api.get(`/tasks?${q}`),
        api.get("/categories"),
      ]);
      setTasks(a.data);
      setCategories(b.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [filters.search, filters.category, filters.priority, filters.status]);
  async function save(data) {
    try {
      if (editing) await api.put(`/tasks/${editing._id}`, data);
      else await api.post("/tasks", data);
      toast.success(editing ? "Task updated" : "Task created");
      setModal(false);
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not save task");
    }
  }
  async function del(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      load();
    } catch (e) {
      toast.error("Delete failed");
    }
  }
  async function status(id, status) {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      load();
    } catch (e) {
      toast.error("Status update failed");
    }
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Task Management
          </p>
          <h1 className="text-3xl font-black dark:text-white">My Tasks</h1>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
          className="btn-primary"
        >
          + Create Task
        </button>
      </div>
      <div className="card grid gap-3 p-4 md:grid-cols-4">
        <input
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="input md:col-span-1"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="input"
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="input"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.length ? (
            tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                onEdit={(t) => {
                  setEditing(t);
                  setModal(true);
                }}
                onDelete={del}
                onStatus={status}
              />
            ))
          ) : (
            <div className="card col-span-full p-12 text-center text-slate-500">
              No tasks match your filters.
            </div>
          )}
        </div>
      )}
      {modal && (
        <TaskForm
          task={editing}
          categories={categories}
          onSubmit={save}
          onClose={() => {
            setModal(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
