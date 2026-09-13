import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App(){
 return <Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/forgot-password" element={<ForgotPassword/>}/>
  <Route path="/reset-password/:token" element={<ResetPassword/>}/>
  <Route element={<ProtectedRoute/>}>
   <Route element={<Layout/>}>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/tasks" element={<Tasks/>}/>
    <Route path="/categories" element={<Categories/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/settings" element={<Settings/>}/>
   </Route>
  </Route>
  <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
 </Routes>
}
