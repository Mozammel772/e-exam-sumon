import { Navigate } from "react-router-dom";
import { useGetAUserProfileByEmailQuery } from "../redux/api/slices/authSlice";
import { Outlet } from "react-router";
import ClientLayout from "../layouts/clientLayout/ClientLayout";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import ClientLoader from "../utils/loader/ClientLoader";
import Login from "../components/auth/Login";

const ProtectedRoute = () => {
  const email = localStorage.getItem("email");
  const { data: user, isLoading } = useGetAUserProfileByEmailQuery(email);
  if (isLoading) {
    return <ClientLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.user?.role === "user") {
    return <ClientLayout />;
  }
  if (user?.user?.role === "admin") {
    return <AdminLayout />;
  }

  if (!user?.user?.role === "admin") {
    return <Login />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
