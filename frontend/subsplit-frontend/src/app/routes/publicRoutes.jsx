import React from "react";
import Auth from "../../features/auth/pages/Auth";
import Register from "../../features/auth/pages/Register";
import { ROUTES } from "../../config/routes";

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <Auth />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
];

export default publicRoutes;
