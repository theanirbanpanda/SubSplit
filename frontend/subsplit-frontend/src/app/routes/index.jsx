import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./privateRoutes";
import PublicRoute from "../../components/common/PublicRoute";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import MainLayout from "../../components/layout/MainLayout";
import { ROUTES } from "../../config/routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Unauthenticated / Public Routes */}
        <Route element={<PublicRoute />}>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Authenticated / Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<MainLayout />}>
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path.replace(/^\//, '')}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
