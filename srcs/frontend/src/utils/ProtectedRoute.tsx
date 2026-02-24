import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from '@/utils/ZuStand';

interface Props {
  allowedRoles: string[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();
    
    console.log("allowedRoles: ", allowedRoles);
    if (!user) {
      return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    const hasAccess = allowedRoles.includes(user.role);

    if (hasAccess) {
      return <Outlet />;
    }

    return user.role === "candidate" 
      ? <Navigate to="/Jobs" replace /> 
      : <Navigate to="/NotFound" replace />;
}