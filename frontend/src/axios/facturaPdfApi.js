import api from "./apiBase";

export const facturaPdfApi = {
    getPdf: async (id) => {
        try {
            // Espera un blob PDF del backend
            const response = await api.get(`/facturapdf/${id}`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("PDF de factura no encontrado");
            }
            throw new Error("Error al obtener el PDF de la factura");
        }
    }
};