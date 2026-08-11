import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Auth from "../features/auth/pages/Auth";
import Dashboard from "../features/dashboard/Dashboard";
import Groups from "../features/groups/Groups";
import Expenses from "../features/expenses/Expenses";
import Settlements from "../features/settlements/Settlements";
import Profile from "../features/profile/Profile";
import UserReviewsPage from "../features/profile/pages/UserReviewsPage";
import LandingPage from "../features/landing/pages/LandingPage";
import Marketplace from "../features/marketplace/Marketplace";
import ListingDetails from "../features/marketplace/ListingDetails";
import HostCenter from "../features/host/HostCenter";
import NotificationsCenter from "../features/notifications/NotificationsCenter";
import Messages from "../features/messages/Messages";
import AdminDashboard from "../features/admin/AdminDashboard";
import PrivateRoute from "../components/routes/PrivateRoute";
import PublicRoute from "../components/routes/PublicRoute";

import { useSelector } from "react-redux";

function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function AdminRoute() {
  const { user } = useSelector((state) => state.auth || {});
  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN' ||
    user?.role?.name === 'ADMIN' ||
    user?.role?.name === 'ROLE_ADMIN' ||
    user?.isAdmin === true;

  return isAdmin ? <AdminDashboard /> : <Navigate to="/app/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigation />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public-only Auth Route */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* Protected Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Navigate to="/app/marketplace" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="marketplace/:id" element={<ListingDetails />} />
            <Route path="marketplace/listing/:id" element={<ListingDetails />} />
            <Route path="groups" element={<Navigate to="/app/dashboard" replace />} />

            <Route path="expenses" element={<Expenses />} />
            <Route path="settlements" element={<Settlements />} />
            <Route path="host" element={<HostCenter />} />
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="messages" element={<Messages />} />
            <Route path="admin" element={<AdminRoute />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/reviews" element={<UserReviewsPage />} />
          </Route>
        </Route>



        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
