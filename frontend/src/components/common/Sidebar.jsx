import { NavLink, useNavigate } from "react-router-dom";
import { FiBarChart2, FiCheckSquare, FiFolder, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const links = [
  ["/dashboard", "Dashboard", FiBarChart2],
  ["/tasks", "Tasks", FiCheckSquare],
  ["/categories", "Categories", FiFolder],
  ["/profile", "Profile", FiUser]
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose}/>}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-slate-200 bg-white p-5 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:z-auto lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-9 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 font-black text-white">TF</div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white">TaskFlow Pro</div>
            <div className="text-xs text-slate-500">Manage. Track. Complete.</div>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} onClick={onClose} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
              <Icon size={18}/>{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
          <NavLink to="/settings" onClick={onClose} className={({isActive}) => `mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
            <FiSettings/> Settings
          </NavLink>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <FiLogOut/> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
