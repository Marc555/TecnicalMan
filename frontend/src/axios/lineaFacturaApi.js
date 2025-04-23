import api from "./apiBase";

export const lineaFacturaApi = {
    getAll: async () => {
        try {
            const response = await api.get("/lineas-factura");
            return response.data;
        } catch (error) {
            throw new Error("Error al obtener las líneas de factura");
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/lineas-factura/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("Línea de factura no encontrada");
            }
            throw new Error("Error al obtener la línea de factura");
        }
    },

    create: async (lineaFactura) => {
        try {
            const response = await api.post("/lineas-factura", lineaFactura);
            return response.data;
        } catch (error) {
            throw new Error("Error al crear la línea de factura");
        }
    },

    update: async (id, lineaFactura) => {
        try {
            const response = await api.put(`/lineas-factura/${id}`, lineaFactura);
            return response.data;
        } catch (error) {
            throw new Error("Error al actualizar la línea de factura");
        }
    },

    delete: async (id) => {
        try {
            await api.delete(`/lineas-factura/${id}`);
        } catch (error) {
            throw new Error("Error al eliminar la línea de factura");
        }
    }
};