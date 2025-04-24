import React from "react";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth"; // Importamos el hook useAuth

const HomePage = () => {
    const { handleLogout } = useAuth(); // Obtenemos la función handleLogout del hook

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Pasamos la función handleLogout al TopBar */}
            <TopBar onLogout={handleLogout} />
            <div className="flex-grow flex flex-col items-center p-4">
                <h1 className="text-black text-2xl font-bold mb-4">Bienvenido al Home</h1>
            </div>
        </div>
    );
};

export default HomePage;