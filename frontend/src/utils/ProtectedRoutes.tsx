import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoutes = () => {
    // const [user, setUser] = useState(null);
    const user = true;
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch("http://localhost:3000/auth/status", {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //             if (response) {
    //                 console.log("hello herereeee");
    //                 const data = await response.json();
    //                 setUser(data.user);
    //             } else {
    //                 console.log("user doesn't auth");
    //                 setUser(null);
    //             }
    //         } catch (error) {
    //             console.error("Auth check failed:", error);
    //             setUser(null);
    //         }
    //     };

    //     checkAuth();
    // }, []);
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;