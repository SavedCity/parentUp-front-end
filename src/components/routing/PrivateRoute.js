import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateRoute() {
  const { currentUser } = useAuth();

  let location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }
  return <Outlet />;
}
