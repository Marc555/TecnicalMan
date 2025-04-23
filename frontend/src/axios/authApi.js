// authApi.js
import api from "./apiBase"; // Asumo que apiBase.js ya tiene la configuración base de Axios

export const authApi = {
    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            return response.data.token; // Devuelve solo el token
        } catch (error) {
            // Puedes manejar diferentes tipos de errores aquí
            if (error.response && error.response.status === 403) {
                throw new Error("Credenciales incorrectas");
            }
            throw new Error("Error al intentar iniciar sesión");
        }
    },

    validateToken: async (token) => {
        try {
            const response = await api.get("/auth/validate", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; // Devuelve la respuesta completa
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error("Token inválido o expirado");
            }
            throw new Error("Error al validar el token");
        }
    },
};