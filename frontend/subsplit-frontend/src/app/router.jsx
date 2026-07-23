import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Auth from "../features/auth/pages/Auth";
import Dashboard from "../features/dashboard/Dashboard";
import Groups from "../features/groups/Groups";
import Expenses from "../features/expenses/Expenses";
import Settlements from "../features/settlements/Settlements";
import Profile from "../features/profile/Profile";
import LandingPage from "../features/landing/pages/LandingPage";
import Marketplace from "../features/marketplace/Marketplace";
import ListingDetails from "../features/marketplace/ListingDetails";
import HostCenter from "../features/host/HostCenter";
import NotificationsCenter from "../features/notifications/NotificationsCenter";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Main Application Layout with Nested Routes */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<ListingDetails />} />
          <Route path="groups" element={<Groups />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="settlements" element={<Settlements />} />
          <Route path="host" element={<HostCenter />} />
          <Route path="notifications" element={<NotificationsCenter />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
