import { useState, useEffect } from "react";
import { authApi } from "../axios/authApi";  // Cambiado para importar authApi
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
                    await authApi.validateToken(token);  // Usando authApi
                    setIsAuthenticated(true);
                } catch (err) {
                    removeToken();
                    setIsAuthenticated(false);
                    setError(err.message);  // Capturar el mensaje de error
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await authApi.login(email, password);  // Usando authApi
            setToken(token);
            setIsAuthenticated(true);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        setIsAuthenticated(false);
        navigate('/login');
        setError(null);
    };

    return {
        isAuthenticated,
        loading,
        error,
        handleLogin,
        handleLogout  // Añadida función de logout
    };
};