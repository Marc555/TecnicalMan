import api from "./apiBase";

export const clienteApi = {
    getAll: async () => {
        try {
            const response = await api.get("/clientes");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener la lista de clientes");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/clientes/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Cliente no encontrado");
            }
            throw new Error("Error al obtener el cliente");
        }
    },

    create: async (clienteData) => {
        try {
            const response = await api.post("/clientes", clienteData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al crear el cliente");
        }
    },

    update: async (id, clienteData) => {
        try {
            const response = await api.put(`/clientes/${id}`, clienteData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Cliente no encontrado para actualizar");
            }
            throw new Error(error.response?.data?.message || "Error al actualizar el cliente");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/clientes/${id}`);
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error("Cliente no encontrado para eliminar");
            }
            throw new Error("Error al eliminar el cliente");
        }
    }
};