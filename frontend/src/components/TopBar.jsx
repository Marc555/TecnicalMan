import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Importamos el hook de autenticación

const TopBar = () => {
    const navigate = useNavigate();
    const { handleLogout } = useAuth(); // Obtenemos la función de logout del hook

    return (
        <div className="w-full bg-black py-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center space-x-6">
                    <button
                        onClick={() => navigate('/clientes')} // Navegación real en lugar de console.log
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        Clientes
                    </button>
                    <button
                        onClick={() => navigate('/presupuestos')}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        Presupuestos
                    </button>
                    <button
                        onClick={() => navigate('/albaranes')}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        Albaranes
                    </button>
                    <button
                        onClick={() => navigate('/facturas')}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        Facturas
                    </button>
                    <button
                        onClick={handleLogout} // Usamos la función del hook
                        className="!bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;