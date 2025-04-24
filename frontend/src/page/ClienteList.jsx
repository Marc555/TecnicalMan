import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import { clienteApi } from '../axios/clienteApi';

const ClienteList = () => {
    const { handleLogout } = useAuth();

    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await clienteApi.getAll();
                setClientes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await clienteApi.delete(id);
            setClientes(clientes.filter(cliente => cliente.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Cargando clientes...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-bold text-black mb-6">Lista de Clientes</h2>
                <ul className="space-y-3">
                    {clientes.map(cliente => (
                        <li
                            key={cliente.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                        >
                            <div className="text-black">
                                <span className="font-medium">{cliente.nombre}</span> - {cliente.email}
                            </div>
                            <button
                                onClick={() => handleDelete(cliente.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClienteList;