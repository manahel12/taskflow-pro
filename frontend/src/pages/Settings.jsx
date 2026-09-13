import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBell, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function Settings() {
  const { dark, setDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => {
        setNotifications(data.settings.notifications);
        if (data.settings.darkMode !== dark) setDark(data.settings.darkMode);
      })
      .catch(() => toast.error("Could not load settings"));
  }, []);

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/settings", { notifications, darkMode: dark });
      setNotifications(data.settings.notifications);
      setDark(data.settings.darkMode);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save settings");
    } finally { setSaving(false); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div><p className="text-sm font-semibold text-indigo-600">Preferences</p><h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1><p className="mt-1 text-sm text-slate-500">Customize how TaskFlow Pro works for you.</p></div>
      <form onSubmit={saveSettings} className="card divide-y divide-slate-200 dark:divide-slate-800">
        <div className="flex items-center justify-between gap-4 p-6"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950"><FiBell/></div><div><h2 className="font-extrabold dark:text-white">Notifications</h2><p className="mt-1 text-sm text-slate-500">Show task and workspace notifications in the notification panel.</p></div></div><button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications(!notifications)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${notifications ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${notifications ? "left-6" : "left-1"}`} /></button></div>
        <div className="flex items-center justify-between gap-4 p-6"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950">{dark ? <FiMoon/> : <FiSun/>}</div><div><h2 className="font-extrabold dark:text-white">Appearance</h2><p className="mt-1 text-sm text-slate-500">Switch between light and dark mode.</p></div></div><button type="button" onClick={() => setDark(!dark)} className="btn-secondary shrink-0">{dark ? "Dark mode" : "Light mode"}</button></div>
        <div className="flex justify-end p-6"><button disabled={saving} type="submit" className="btn-primary disabled:opacity-60">{saving ? "Saving..." : "Save Settings"}</button></div>
      </form>
    </div>
  );
}
