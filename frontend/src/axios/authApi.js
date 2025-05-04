import api from "./apiBase";

export const authApi = {
    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            return response.data.token; 
        } catch (error) {
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
            return response.data; 
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error("Token inválido o expirado");
            }
            throw new Error("Error al validar el token");
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data.message; // Devuelve el mensaje de éxito
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Usuario no encontrado");
            }
            throw new Error("Error al enviar el correo de recuperación");
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post("/auth/reset-password", {
                token,
                password: newPassword,
            });
            return response.data.message; // Devuelve el mensaje de éxito
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error("Token inválido o expirado");
            }
            throw new Error("Error al restablecer la contraseña");
        }
    },
};