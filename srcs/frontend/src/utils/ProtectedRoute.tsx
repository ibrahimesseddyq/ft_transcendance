import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from '@/utils/ZuStand';

export function ProtectedRoute(){
    const user = useAuthStore((state) => state.user);
    console.log("user role : ", user?.role);
    if (user?.role === "recruiter" || user?.role === "admin")
    {
        // setTimeout(()=>{}, 10000000);
        console.log("***************hi iam here 1 *************");
        return (<Outlet />);
    }
    console.log("***************hi iam here 2 *************");
    return <Navigate to={'/NotFound'}/>;
}