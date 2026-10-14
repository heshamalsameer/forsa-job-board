import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useJobs } from "../Context/Context";

export const PrivateRoutes = ({ role }) => {
  const ctx = useJobs();
  const location = useLocation();
  if (!ctx.login) return <Navigate to={`/signin?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (role && ctx.user.loginby !== role) return <Navigate to="/" replace />;
  return <Outlet />;
};
