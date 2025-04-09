import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar"; // Asegúrate de que la ruta sea correcta

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem("token");

        // Redirige al login
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <TopBar />
            <div className="flex-grow flex flex-col items-center p-4">
                <h1 className="text-black text-2xl font-bold mb-4">Bienvenido al Home</h1>
            </div>
        </div>
    );
};

export default HomePage;