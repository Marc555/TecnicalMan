import { useState, useEffect } from "react";
import { login, validateToken } from "../axios/authApi";
import { getToken, setToken, removeToken } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    await validateToken(token);
                    setIsAuthenticated(true);
                } catch {
                    removeToken();
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = async (email, password) => {
        try {
            const token = await login(email, password);
            setToken(token);
            setIsAuthenticated(true);
            setError(null); // Limpiar el error en caso de login exitoso
            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    };

    return { isAuthenticated, loading, handleLogin, error };
};