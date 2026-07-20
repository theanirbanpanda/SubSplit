import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Auth from "../features/auth/pages/Auth";
import Dashboard from "../features/dashboard/Dashboard";
import Groups from "../features/groups/Groups";
import Expenses from "../features/expenses/Expenses";
import Settlements from "../features/settlements/Settlements";
import Profile from "../features/profile/Profile";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Main Application Layout with Nested Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="settlements" element={<Settlements />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
