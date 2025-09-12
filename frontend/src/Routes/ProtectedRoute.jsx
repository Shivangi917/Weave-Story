import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return loggedIn ? children : <Navigate to="/login" replace />;
}
