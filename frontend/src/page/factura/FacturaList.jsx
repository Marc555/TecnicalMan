import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { facturaApi } from "../../axios/facturaApi";
import { lineaFacturaApi } from "../../axios/lineaFacturaApi";
import { facturaPdfApi } from "../../axios/facturaPdfApi"; // <--- NUEVO
import { saveAs } from "file-saver"; // <--- NUEVO

const FacturaList = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const [facturas, setFacturas] = useState([]);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [facturaToDelete, setFacturaToDelete] = useState(null);
    const [downloadingPdfId, setDownloadingPdfId] = useState(null);

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const data = await facturaApi.getAll();
                setFacturas(data);
                setFilteredFacturas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFacturas();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredFacturas(facturas);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = facturas.filter(f =>
                f.titulo.toLowerCase().includes(term) ||
                (f.estado && f.estado.toLowerCase().includes(term))
            );
            setFilteredFacturas(filtered);
        }
    }, [searchTerm, facturas]);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setFacturaToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Obtener las líneas asociadas a la factura
            const lineasFactura = await lineaFacturaApi.getAll();
            const lineasToDelete = lineasFactura.filter((linea) => linea.idFactura === facturaToDelete);

            // Borrar todas las líneas asociadas a la factura
            await Promise.all(
                lineasToDelete.map(async (linea) => {
                    await lineaFacturaApi.delete(linea.id);
                })
            );

            // Borrar la factura
            await facturaApi.delete(facturaToDelete);

            // Actualizar el estado local
            const updated = facturas.filter(f => f.id !== facturaToDelete);
            setFacturas(updated);
            setFilteredFacturas(updated.filter(f =>
                f.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (f.estado && f.estado.toLowerCase().includes(searchTerm.toLowerCase()))
            ));

            setShowDeleteModal(false);
            setFacturaToDelete(null);
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setFacturaToDelete(null);
    };

    const handleAdd = () => {
        navigate(`/facturas/nueva`);
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/facturas/editar/${id}`);
    };

    const handleDownloadPdf = async (id, e) => {
        e.stopPropagation();
        setDownloadingPdfId(id);
        try {
            const pdfBlob = await facturaPdfApi.getPdf(id);
            saveAs(
                new Blob([pdfBlob], { type: "application/pdf" }),
                `factura_FAC${id.toString().padStart(4, '0')}.pdf`
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setDownloadingPdfId(null);
        }
    };

    const handleRowClick = (id, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        navigate(`/facturas/${id}`);
    };

    if (loading) return <div className="p-4 text-gray-800">Cargando facturas...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Facturas</h2>
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
                        Nueva Factura
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-300 pb-2 mb-2 font-semibold text-gray-800">
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Fecha de emisión</div>
                    <div className="col-span-3">Estado</div>
                    <div className="col-span-2">Acciones</div>
                </div>

                <div className="space-y-2">
                    {filteredFacturas.length > 0 ? (
                        filteredFacturas.map(factura => (
                            <div
                                key={factura.id}
                                className="grid grid-cols-12 gap-4 items-center py-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={(e) => handleRowClick(factura.id, e)}
                            >
                                <div className="col-span-4">
                                    <div className="font-medium text-gray-800">{factura.titulo}</div>
                                    <div className="text-xs text-gray-500">ID Cliente: {factura.idCliente}</div>
                                </div>
                                <div className="col-span-3 text-gray-800">
                                    {factura.fechaEmitida
                                        ? new Date(factura.fechaEmitida).toLocaleDateString()
                                        : "No emitida"}
                                </div>
                                <div className={`col-span-3 font-semibold ${factura.estado === "ACEPTADO" ? "text-green-600" :
                                    factura.estado === "RECHAZADO" ? "text-red-600" :
                                        "text-gray-600"
                                    }`}>
                                    {factura.estado}
                                </div>
                                <div className="col-span-2 flex">
                                    <button
                                        onClick={(e) => handleDeleteClick(factura.id, e)}
                                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(factura.id, e)}
                                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => handleDownloadPdf(factura.id, e)}
                                        className="ml-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors text-sm"
                                        disabled={downloadingPdfId === factura.id}
                                    >
                                        {downloadingPdfId === factura.id ? "Descargando..." : "PDF"}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            No se encontraron facturas que coincidan con la búsqueda
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar esta factura y todas sus líneas asociadas? Esta acción no se puede deshacer.</p>
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

export default FacturaList;