import api from "./apiBase";

export const presupuestoApi = {
    getAll: async () => {
        try {
            const response = await api.get("/presupuestos");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener los presupuestos");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/presupuestos/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Presupuesto no encontrado");
            }
            throw new Error("Error al obtener el presupuesto");
        }
    },

    create: async (presupuesto) => {
        try {
            const response = await api.post("/presupuestos", presupuesto);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear el presupuesto");
        }
    },

    update: async (id, presupuesto) => {
        try {
            const response = await api.put(`/presupuestos/${id}`, presupuesto);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar el presupuesto");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/presupuestos/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar el presupuesto");
        }
    }
};