import { useState, useEffect } from 'react';
import axiosInstance from '../axios-instance';

export function useAuth() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const isAuthenticated = !!token;

    return {
        token,
        login,
        logout,
        isAuthenticated
    };
}
