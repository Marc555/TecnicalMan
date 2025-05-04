import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clienteApi } from '../../axios/clienteApi';
import TopBar from "../../components/TopBar";
import { useAuth } from "../../hooks/useAuth";

const ClienteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await clienteApi.getById(id);
                setCliente(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const formatFecha = (timestamp) => {
        if (!timestamp) return 'No disponible';
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) return <div className="p-4 text-gray-800">Cargando cliente...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!cliente) return <div className="p-4 text-gray-800">Cliente no encontrado</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <button
                    onClick={handleBack}
                    className="mb-4 px-4 py-2 bg-gray-200 text-whait rounded hover:bg-gray-300 transition-colors"
                >
                    ← Volver al listado
                </button>

                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del Cliente</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna izquierda - Información básica */}
                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Información Principal</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><span className="font-medium text-gray-900">ID:</span> {cliente.id}</p>
                                    <p><span className="font-medium text-gray-900">Nombre:</span> {cliente.nombre}</p>
                                    <p><span className="font-medium text-gray-900">NIF:</span> {cliente.nif}</p>
                                    <p><span className="font-medium text-gray-900">Fecha de creación:</span> {formatFecha(cliente.fechaCreacion)}</p>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Contacto</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><span className="font-medium text-gray-900">Email:</span> {cliente.email || 'No disponible'}</p>
                                    <p><span className="font-medium text-gray-900">Teléfono:</span> {cliente.telefono || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha - Dirección */}
                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dirección</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p>{cliente.direccion || 'No disponible'}</p>
                                    <p>
                                        {[cliente.ciudad, cliente.codigoPostal].filter(Boolean).join(', ') || 'No disponible'}
                                    </p>
                                    <p>{cliente.provincia || 'No disponible'}</p>
                                    <p>{cliente.pais || 'No disponible'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClienteDetail;