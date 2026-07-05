import { Navigate } from "react-router-dom";

function PublicRoute({ children } : { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token && token !== "undefined" && token !== "null" && token.trim() !== "";

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default PublicRoute;
