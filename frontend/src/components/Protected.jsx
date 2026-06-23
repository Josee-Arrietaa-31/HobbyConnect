import { Navigate } from "react-router-dom";
import { useAuth } from "../store/store.jsx";

export default function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
