import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

export default function Layout() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenu={() => setMenu(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
