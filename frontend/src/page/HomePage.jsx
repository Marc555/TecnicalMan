import React from "react";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth"; // Importamos el hook useAuth
import TaskPage from "../components/TaskPage";

const HomePage = () => {
    const { handleLogout } = useAuth(); // Obtenemos la función handleLogout del hook

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Pasamos la función handleLogout al TopBar */}
            <TopBar onLogout={handleLogout} />
            <div className="flex-grow flex flex-col items-center p-4">
                <TaskPage />
            </div>
        </div>
    );
};

export default HomePage;