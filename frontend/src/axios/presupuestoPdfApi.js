import api from "./apiBase";

export const presupuestoPdfApi = {
    getPdf: async (id) => {
        try {
            // Espera un blob PDF del backend
            const response = await api.get(`/presupuestopdf/${id}`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("PDF de presupuesto no encontrado");
            }
            throw new Error("Error al obtener el PDF del presupuesto");
        }
    }
};