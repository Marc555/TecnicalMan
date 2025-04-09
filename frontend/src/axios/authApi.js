import api from "./apiBase";

export const login = async (email, password) => {
    try {
        const response = await api.post("login", { email, password });
        return response.data.token;
    } catch (error) {
        throw new Error("Credenciales inválidas");
    }
};

export const validateToken = async (token) => {
    try {
        const response = await api.get("validate", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error("Token inválido o expirado");
    }
};