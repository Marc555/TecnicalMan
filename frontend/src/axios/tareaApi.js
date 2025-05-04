import api from "./apiBase";

export const tareaApi = {
    getAll: async () => {
        try {
            const response = await api.get("/tareas");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener la lista de tareas");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/tareas/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Tarea no encontrada");
            }
            throw new Error("Error al obtener la tarea");
        }
    },

    create: async (tareaData) => {
        try {
            const response = await api.post("/tareas", tareaData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al crear la tarea");
        }
    },

    update: async (id, tareaData) => {
        try {
            const response = await api.put(`/tareas/${id}`, tareaData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Tarea no encontrada para actualizar");
            }
            throw new Error(error.response?.data?.message || "Error al actualizar la tarea");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/tareas/${id}`);
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Tarea no encontrada para eliminar");
            }
            throw new Error("Error al eliminar la tarea");
        }
    }
};
