import api from "./apiBase";

export const facturaApi = {
    getAll: async () => {
        try {
            const response = await api.get("/facturas");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener las facturas");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/facturas/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Factura no encontrada");
            }
            throw new Error("Error al obtener la factura");
        }
    },

    create: async (factura) => {
        try {
            const response = await api.post("/facturas", factura);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear la factura");
        }
    },

    update: async (id, factura) => {
        try {
            const response = await api.put(`/facturas/${id}`, factura);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar la factura");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/facturas/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar la factura");
        }
    }
};