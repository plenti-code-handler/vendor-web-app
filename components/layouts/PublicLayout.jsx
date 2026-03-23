"use client";

import { useProtectedRoute } from "../../hooks/useProtectedRoute";

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);
  return <>{children}</>;
};

export default PublicLayout;

