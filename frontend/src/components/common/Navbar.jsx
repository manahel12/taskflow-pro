import { useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiMenu, FiMoon, FiSun, FiUser, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Navbar({ onMenu }) {
  const { dark, setDark } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  async function loadNotifications() {
    try {
      const [notificationRes, settingsRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/settings")
      ]);
      setNotifications(notificationRes.data);
      setNotificationsEnabled(settingsRes.data.settings.notifications);
    } catch {
      // Keep the navbar usable if the API is temporarily unavailable.
    }
  }

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function markAllRead() {
    try {
      await api.put("/notifications/read-all");
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch { /* no-op */ }
  }

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((items) => items.map((item) => item._id === id ? { ...item, read: true } : item));
    } catch { /* no-op */ }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} aria-label="Open menu" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"><FiMenu size={22}/></button>
        <div className="text-lg font-extrabold text-indigo-600 lg:hidden">TaskFlow Pro</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button onClick={() => setOpen((value) => !value)} aria-label="Notifications" aria-expanded={open} className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiBell size={19}/>
            {notificationsEnabled && unreadCount > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unreadCount}</span>}
          </button>
          {open && (
            <div className="absolute right-0 top-12 z-50 w-[min(90vw,360px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <div><h3 className="font-extrabold text-slate-900 dark:text-white">Notifications</h3><p className="text-xs text-slate-500">{notificationsEnabled ? (unreadCount ? `${unreadCount} unread` : "You're all caught up") : "Notifications are turned off"}</p></div>
                <div className="flex items-center gap-1">
                  {notificationsEnabled && unreadCount > 0 && <button onClick={markAllRead} title="Mark all as read" className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"><FiCheck/></button>}
                  <button onClick={() => setOpen(false)} title="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><FiX/></button>
                </div>
              </div>
              {notificationsEnabled ? (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length ? notifications.map((item) => (
                    <button key={item._id} onClick={() => markRead(item._id)} className="flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${!item.read ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"}`} />
                      <span className="min-w-0"><span className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.title}</span><span className="shrink-0 text-[11px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span></span><span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</span></span>
                    </button>
                  )) : <div className="px-4 py-10 text-center text-sm text-slate-500">No notifications</div>}
                </div>
              ) : <div className="px-4 py-10 text-center text-sm text-slate-500">Turn notifications on from Settings.</div>}
            </div>
          )}
        </div>
        <button onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <FiSun/> : <FiMoon/>}</button>
        <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800"><div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950">{user?.avatar ? <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" /> : <FiUser/>}</div><span className="hidden text-sm font-semibold text-slate-700 dark:text-slate-200 sm:block">{user?.name}</span></div>
      </div>
    </header>
  );
}
