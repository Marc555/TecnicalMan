import api from "./apiBase";

export const lineaAlbaranApi = {
    getAll: async () => {
        try {
            const response = await api.get("/lineas-albaran");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener las líneas de albarán");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/lineas-albaran/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Línea de albarán no encontrada");
            }
            throw new Error("Error al obtener la línea de albarán");
        }
    },

    create: async (lineaAlbaran) => {
        try {
            const response = await api.post("/lineas-albaran", lineaAlbaran);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear la línea de albarán");
        }
    },

    update: async (id, lineaAlbaran) => {
        try {
            const response = await api.put(`/lineas-albaran/${id}`, lineaAlbaran);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar la línea de albarán");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/lineas-albaran/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar la línea de albarán");
        }
    }
};