import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./app/router";
import { fetchCurrentUser, fetchKycStatus, logout } from "./features/auth/authSlice";
import { isTokenValid } from "./utils/tokenUtils";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      if (isTokenValid(token)) {
        dispatch(fetchCurrentUser());
        dispatch(fetchKycStatus());
      } else {
        dispatch(logout());
      }
    }
  }, [dispatch, token]);

  return <AppRoutes />;
}

export default App;
