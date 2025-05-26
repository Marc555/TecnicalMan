import api from "./apiBase";

export const albaranPdfApi = {
    getPdf: async (id) => {
        try {
            // Espera un blob PDF del backend
            const response = await api.get(`/albaranpdf/${id}`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error("PDF de albarán no encontrado");
            }
            throw new Error("Error al obtener el PDF del albarán");
        }
    }
};