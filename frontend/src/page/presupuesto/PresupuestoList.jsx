import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { presupuestoApi } from '../../axios/presupuestoApi';
import { lineaPresupuestoApi } from '../../axios/lineaPresupuestoApi';

const PresupuestoList = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const [presupuestos, setPresupuestos] = useState([]);
    const [filteredPresupuestos, setFilteredPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [presupuestoToDelete, setPresupuestoToDelete] = useState(null);

    useEffect(() => {
        const fetchPresupuestos = async () => {
            try {
                const data = await presupuestoApi.getAll();
                setPresupuestos(data);
                setFilteredPresupuestos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPresupuestos();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredPresupuestos(presupuestos);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = presupuestos.filter(p =>
                p.titulo.toLowerCase().includes(term) ||
                (p.estado && p.estado.toLowerCase().includes(term))
            );
            setFilteredPresupuestos(filtered);
        }
    }, [searchTerm, presupuestos]);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setPresupuestoToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const lineasPresupuesto = await lineaPresupuestoApi.getByPresupuestoId(presupuestoToDelete);
            await Promise.all(
                lineasPresupuesto.map(async (linea) => {
                    await lineaPresupuestoApi.delete(linea.id);
                })
            );

            await presupuestoApi.delete(presupuestoToDelete);

            const updated = presupuestos.filter(p => p.id !== presupuestoToDelete);
            setPresupuestos(updated);
            setFilteredPresupuestos(updated.filter(p =>
                p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.estado && p.estado.toLowerCase().includes(searchTerm.toLowerCase()))
            ));

            setShowDeleteModal(false);
            setPresupuestoToDelete(null);
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setPresupuestoToDelete(null);
    };

    const handleAdd = (e) => {
        e.stopPropagation();
        navigate(`/presupuestos/nuevo`);
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/presupuestos/editar/${id}`);
    };

    const handleRowClick = (id, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        navigate(`/presupuestos/${id}`);
    };

    if (loading) return <div className="p-4 text-gray-800">Cargando presupuestos...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Presupuestos</h2>
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar por título o estado..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        onClick={(e) => handleAdd(e)}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                        Nuevo Presupuesto
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-300 pb-2 mb-2 font-semibold text-gray-800">
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Fecha de emisión</div>
                    <div className="col-span-3">Estado</div>
                    <div className="col-span-2">Acciones</div>
                </div>

                <div className="space-y-2">
                    {filteredPresupuestos.length > 0 ? (
                        filteredPresupuestos.map(presupuesto => (
                            <div
                                key={presupuesto.id}
                                className="grid grid-cols-12 gap-4 items-center py-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => handleRowClick(presupuesto.id, e)}
                            >
                                <div className="col-span-4">
                                    <div className="font-medium text-gray-800">{presupuesto.titulo}</div>
                                    <div className="text-xs text-gray-500">ID Cliente: {presupuesto.idCliente}</div>
                                </div>
                                <div className="col-span-3 text-gray-800">
                                    {presupuesto.fechaEmitida
                                        ? new Date(presupuesto.fechaEmitida).toLocaleDateString()
                                        : "No emitida"}
                                </div>
                                <div className={`col-span-3 font-semibold ${presupuesto.estado === "ACEPTADO" ? "text-green-600" :
                                    presupuesto.estado === "RECHAZADO" ? "text-red-600" :
                                        "text-gray-600"
                                    }`}>
                                    {presupuesto.estado}
                                </div>
                                <div className="col-span-2 flex">
                                    <button
                                        onClick={(e) => handleDeleteClick(presupuesto.id, e)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(presupuesto.id, e)}
                                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            No se encontraron presupuestos que coincidan con la búsqueda
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este presupuesto? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md text-white hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-red-400 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresupuestoList;