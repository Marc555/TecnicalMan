import api from "./apiBase";

export const lineaPresupuestoApi = {
    getAll: async () => {
        try {
            const response = await api.get("/lineas-presupuesto");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener las líneas de presupuesto");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/lineas-presupuesto/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Línea de presupuesto no encontrada");
            }
            throw new Error("Error al obtener la línea de presupuesto");
        }
    },

    getByPresupuestoId: async (idPresupuesto) => {
        try {
            const allLineas = await lineaPresupuestoApi.getAll();
            return allLineas.filter((linea) => linea.idPresupuesto === idPresupuesto);
        } catch (error) {
            console.error('Error al filtrar las líneas de presupuesto:', error.message);
            throw error;
        }
    },

    create: async (lineaPresupuesto) => {
        try {
            const response = await api.post("/lineas-presupuesto", lineaPresupuesto);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear la línea de presupuesto");
        }
    },

    update: async (id, lineaPresupuesto) => {
        try {
            const response = await api.put(`/lineas-presupuesto/${id}`, lineaPresupuesto);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar la línea de presupuesto");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/lineas-presupuesto/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar la línea de presupuesto");
        }
    }
};