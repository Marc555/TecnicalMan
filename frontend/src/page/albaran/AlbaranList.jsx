import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { albaranApi } from "../../axios/albaranApi";
import { lineaAlbaranApi } from "../../axios/lineaAlbaranApi";
import { albaranPdfApi } from "../../axios/albaranPdfApi"; // <-- IMPORTA LA API DEL PDF
import { saveAs } from "file-saver"; // <-- ASEGÚRATE DE TENER INSTALADO 'file-saver'

const AlbaranList = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const [albaranes, setAlbaranes] = useState([]);
    const [filteredAlbaranes, setFilteredAlbaranes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [albaranToDelete, setAlbaranToDelete] = useState(null);

    useEffect(() => {
        const fetchAlbaranes = async () => {
            try {
                const data = await albaranApi.getAll();
                setAlbaranes(data);
                setFilteredAlbaranes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbaranes();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredAlbaranes(albaranes);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = albaranes.filter(a =>
                a.titulo.toLowerCase().includes(term) ||
                (a.estado && a.estado.toLowerCase().includes(term))
            );
            setFilteredAlbaranes(filtered);
        }
    }, [searchTerm, albaranes]);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setAlbaranToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Obtener las líneas asociadas al albarán
            const lineasAlbaran = await lineaAlbaranApi.getAll();
            const lineasToDelete = lineasAlbaran.filter((linea) => linea.idAlbaran === albaranToDelete);

            // Borrar todas las líneas asociadas al albarán
            await Promise.all(
                lineasToDelete.map(async (linea) => {
                    await lineaAlbaranApi.delete(linea.id);
                })
            );

            // Borrar el albarán
            await albaranApi.delete(albaranToDelete);

            // Actualizar el estado local
            const updated = albaranes.filter(a => a.id !== albaranToDelete);
            setAlbaranes(updated);
            setFilteredAlbaranes(updated.filter(a =>
                a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (a.estado && a.estado.toLowerCase().includes(searchTerm.toLowerCase()))
            ));

            setShowDeleteModal(false);
            setAlbaranToDelete(null);
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setAlbaranToDelete(null);
    };

    const handleAdd = () => {
        navigate(`/albaranes/nuevo`);
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/albaranes/editar/${id}`);
    };

    const handleDownloadPdf = async (id, e) => {
        e.stopPropagation();
        try {
            const blob = await albaranPdfApi.getPdf(id);
            saveAs(
                new Blob([blob], { type: "application/pdf" }),
                `albaran_ALB${id.toString().padStart(4, '0')}.pdf`
            );
        } catch (error) {
            setError("No se pudo descargar el PDF del albarán.");
        }
    };

    const handleRowClick = (id, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        navigate(`/albaranes/${id}`);
    };

    if (loading) return <div className="p-4 text-gray-800">Cargando albaranes...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Albaranes</h2>
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
                        onClick={handleAdd}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                        Nuevo Albarán
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-300 pb-2 mb-2 font-semibold text-gray-800">
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Fecha de emisión</div>
                    <div className="col-span-3">Estado</div>
                    <div className="col-span-2">Acciones</div>
                </div>

                <div className="space-y-2">
                    {filteredAlbaranes.length > 0 ? (
                        filteredAlbaranes.map(albaran => (
                            <div
                                key={albaran.id}
                                className="grid grid-cols-12 gap-4 items-center py-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => handleRowClick(albaran.id, e)}
                            >
                                <div className="col-span-4">
                                    <div className="font-medium text-gray-800">{albaran.titulo}</div>
                                    <div className="text-xs text-gray-500">ID Cliente: {albaran.idCliente}</div>
                                </div>
                                <div className="col-span-3 text-gray-800">
                                    {albaran.fechaEmitida
                                        ? new Date(albaran.fechaEmitida).toLocaleDateString()
                                        : "No emitida"}
                                </div>
                                <div className={`col-span-3 font-semibold ${albaran.estado === "ACEPTADO" ? "text-green-600" :
                                    albaran.estado === "RECHAZADO" ? "text-red-600" :
                                        "text-gray-600"
                                    }`}>
                                    {albaran.estado}
                                </div>
                                <div className="col-span-2 flex">
                                    <button
                                        onClick={(e) => handleDeleteClick(albaran.id, e)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(albaran.id, e)}
                                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => handleDownloadPdf(albaran.id, e)}
                                        className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                        title="Descargar PDF"
                                    >
                                        PDF
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            No se encontraron albaranes que coincidan con la búsqueda
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este albarán y todas sus líneas asociadas? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md text-white hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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

export default AlbaranList;