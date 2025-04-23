import api from "./apiBase";

export const albaranApi = {
    getAll: async () => {
        try {
            const response = await api.get("/albarans");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener los albaranes");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/albarans/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Albarán no encontrado");
            }
            throw new Error("Error al obtener el albarán");
        }
    },

    create: async (albaran) => {
        try {
            const response = await api.post("/albarans", albaran);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear el albarán");
        }
    },

    update: async (id, albaran) => {
        try {
            const response = await api.put(`/albarans/${id}`, albaran);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar el albarán");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/albarans/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar el albarán");
        }
    }
};