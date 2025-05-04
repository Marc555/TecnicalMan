import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { clienteApi } from '../../axios/clienteApi';

const ClienteList = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await clienteApi.getAll();
                setClientes(data);
                setFilteredClientes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredClientes(clientes);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = clientes.filter(cliente =>
                cliente.nombre.toLowerCase().includes(term) ||
                (cliente.direccion && cliente.direccion.toLowerCase().includes(term)) ||
                (cliente.nif && cliente.nif.toLowerCase().includes(term))
            );
            setFilteredClientes(filtered);
        }
    }, [searchTerm, clientes]);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setClienteToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await clienteApi.delete(clienteToDelete);
            const updatedClientes = clientes.filter(cliente => cliente.id !== clienteToDelete);
            setClientes(updatedClientes);
            setFilteredClientes(updatedClientes.filter(cliente =>
                cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cliente.direccion && cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (cliente.nif && cliente.nif.toLowerCase().includes(searchTerm.toLowerCase()))
            ));
            setShowDeleteModal(false);
            setClienteToDelete(null);
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setClienteToDelete(null);
    };

    const handleAdd = (e) => {
        e.stopPropagation();
        navigate(`/clientes/nuevo`);
    };

    const handleEdit = (id, e) => {
        e.stopPropagation();
        navigate(`/clientes/editar/${id}`);
    };

    const handleRowClick = (id, e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        navigate(`/clientes/${id}`);
    };

    if (loading) return <div className="p-4 text-gray-800">Cargando clientes...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Lista de Clientes</h2>
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, dirección o NIF..."
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
                        Nuevo Cliente
                    </button>
                </div>

                {/* Cabecera de la tabla */}
                <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-300 pb-2 mb-2 font-semibold text-gray-800">
                    <div className="col-span-3">Nombre</div>
                    <div className="col-span-2">NIF</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Teléfono</div>
                    <div className="col-span-2">Acciones</div>
                </div>

                {/* Lista de clientes */}
                <div className="space-y-2">
                    {filteredClientes.length > 0 ? (
                        filteredClientes.map(cliente => (
                            <div
                                key={cliente.id}
                                className={`grid grid-cols-12 gap-4 items-center py-3 border-b ${!cliente.nif ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'} cursor-pointer`}
                                onClick={(e) => handleRowClick(cliente.id, e)}
                            >
                                <div className="col-span-3">
                                    <div className={`font-medium ${!cliente.nif ? 'text-red-800' : 'text-gray-800'}`}>
                                        {cliente.nombre}
                                    </div>
                                    <div className={`text-xs ${!cliente.nif ? 'text-red-600' : 'text-gray-500'}`}>
                                        {cliente.direccion}
                                    </div>
                                </div>
                                <div className={`col-span-2 ${!cliente.nif ? 'text-red-600 font-semibold' : 'text-gray-800'}`}>
                                    {cliente.nif || 'NIF FALTANTE'}
                                </div>
                                <div className={`col-span-3 ${!cliente.nif ? 'text-red-800' : 'text-gray-800'}`}>
                                    {cliente.email}
                                </div>
                                <div className={`col-span-2 ${!cliente.nif ? 'text-red-800' : 'text-gray-800'}`}>
                                    {cliente.telefono}
                                </div>
                                <div className="col-span-2 flex">
                                    <button
                                        onClick={(e) => handleDeleteClick(cliente.id, e)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(cliente.id, e)}
                                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            No se encontraron clientes que coincidan con la búsqueda
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar eliminación</h3>
                        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
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

export default ClienteList;