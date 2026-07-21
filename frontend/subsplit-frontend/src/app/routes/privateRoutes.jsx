import React from "react";
import Dashboard from "../../features/dashboard/pages/Dashboard";
import { ROUTES } from "../../config/routes";

export const privateRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
];

export default privateRoutes;
