import React, { useState } from "react";
import { authApi } from "../axios/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const responseMessage = await authApi.forgotPassword(email);
            setMessage(responseMessage);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md relative">
                {/* Botón flecha para redirigir al login */}
                <button
                    onClick={handleLoginRedirect}
                    className="absolute top-4 left-4 focus:outline-none !bg-transparent"
                    aria-label="Regresar al login"
                >
                    {/* Flecha SVG en gris */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="gray"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-700 text-center">Recuperar Contraseña</h1>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Enviar
                    </button>
                </form>
                {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
                {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordForm;