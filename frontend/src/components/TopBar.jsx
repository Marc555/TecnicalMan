import React from "react";

const TopBar = () => {

    const handleLogout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem("token");

        // Redirige al login
        navigate("/login");
    };

    return (
        <div className="w-full bg-black py-4 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center space-x-6">
                    <button
                        onClick={() => console.log("Clientes")}>
                        Clientes
                    </button>
                    <button
                        onClick={() => console.log("Presupuestos")}>
                        Presupuestos
                    </button>
                    <button
                        onClick={() => console.log("Albaranes")}>
                        Albaranes
                    </button>
                    <button
                        onClick={() => console.log("Facturas")}>
                        Facturas
                    </button>
                    <button
                        className="!bg-red-600 !justify-end"
                        onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;