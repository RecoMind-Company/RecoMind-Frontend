import { Navigate } from "react-router-dom";

function PublicRoute({ children } : { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/home" />;
  }
  return children;
}

export default PublicRoute;
