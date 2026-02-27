import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import Cookies from 'js-cookie';

export function useSecureFetch() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const secureFetch = async (path: string, options: RequestInit = {}) => {
        const fullUrl = `${BACKEND_URL}${path}`;
        
        const fetchOptions: RequestInit = {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };
        let response = await fetch(fullUrl, fetchOptions);

        if (response.status === 401) {
            try {
                const refreshRes = await fetch(`${BACKEND_URL}/api/refresh`, { 
                    method: 'POST', 
                    credentials: 'include' 
                });

                if (refreshRes.ok) {
                    return await fetch(fullUrl, fetchOptions);
                } else {
                    handleLogout();
                    throw new Error("Session expired. Please login again.");
                }
            } catch (error) {
                handleLogout();
                return Promise.reject(error);
            }
        }

        return response;
    };

    const handleLogout = () => {
        clearAuth();
        Cookies.remove('accessToken', { path: '/' }); 
        navigate('/Login', { replace: true });
    };

    return secureFetch;
}