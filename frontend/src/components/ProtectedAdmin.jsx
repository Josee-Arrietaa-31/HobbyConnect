import { Navigate } from "react-router-dom";
import { useAuth } from "../store/store.jsx";

export default function ProtectedAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
