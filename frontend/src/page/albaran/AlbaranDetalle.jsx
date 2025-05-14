import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { albaranApi } from "../../axios/albaranApi";
import { lineaAlbaranApi } from "../../axios/lineaAlbaranApi";
import { clienteApi } from "../../axios/clienteApi";

const AlbaranDetalle = () => {
    const { id } = useParams(); // Capturamos el ID del albarán desde la URL
    const navigate = useNavigate(); // Para redirigir al listado y a la edición
    const [albaran, setAlbaran] = useState(null);
    const [lineas, setLineas] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar datos del albarán
                const albaranData = await albaranApi.getById(id);
                setAlbaran(albaranData);
                console.log("Albarán cargado:", albaranData);

                // Cargar datos del cliente
                if (albaranData.idCliente) {
                    const clienteData = await clienteApi.getById(albaranData.idCliente);
                    setCliente(clienteData);
                    console.log("Cliente cargado:", clienteData);
                }

                // Cargar líneas de albarán
                const lineasData = await lineaAlbaranApi.getAll();
                const lineasFiltradas = lineasData.filter((linea) => linea.idAlbaran === parseInt(id));
                setLineas(lineasFiltradas);
                console.log("Líneas cargadas:", lineasFiltradas);
            } catch (err) {
                console.error("Error al cargar los datos:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="p-4 text-gray-800">Cargando albarán...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    const totalSinIVA = lineas.reduce((acc, linea) => acc + linea.cantidad * linea.precioUnitario, 0);
    const IVA = 0.21; // IVA estándar del 21%
    const totalIVA = totalSinIVA * IVA;
    const totalConIVA = totalSinIVA + totalIVA;

    return (
        <div className="bg-white p-8 mx-auto border border-gray-300 shadow-lg">
            {/* Botones de navegación */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/albaranes")}
                    className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
                >
                    Volver al Listado
                </button>
                <button
                    onClick={() => navigate(`/albaranes/editar/${id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Editar Albarán
                </button>
            </div>

            {/* Encabezado del albarán */}
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Albarán</h1>
                        <p className="text-sm text-gray-600">Número: {albaran?.id}</p>
                        <p className="text-sm text-gray-600">Título: {albaran?.titulo}</p>
                        {albaran?.fechaEmitida ? (
                            <p className="text-sm text-gray-600">
                                Fecha de emisión: {new Date(albaran.fechaEmitida).toLocaleDateString()}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">Fecha de emisión: No emitida</p>
                        )}
                        {albaran?.fechaValidez && (
                            <p className="text-sm text-gray-600">
                                Validez hasta: {new Date(albaran.fechaValidez).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-semibold text-gray-800">Mi Empresa S.L.</h2>
                        <p className="text-sm text-gray-600">CIF: B12345678</p>
                        <p className="text-sm text-gray-600">Calle Falsa 123</p>
                        <p className="text-sm text-gray-600">28080, Madrid</p>
                        <p className="text-sm text-gray-600">Tel: +34 600 123 456</p>
                        <p className="text-sm text-gray-600">Email: contacto@miempresa.com</p>
                    </div>
                </div>
            </header>

            {/* Datos del cliente */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-gray-800">Datos del Cliente</h3>
                {cliente ? (
                    <div className="text-sm text-gray-600">
                        <p><strong>Nombre:</strong> {cliente.nombre}</p>
                        <p><strong>NIF:</strong> {cliente.nif}</p>
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                        <p><strong>Email:</strong> {cliente.email}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Cargando datos del cliente...</p>
                )}
            </section>

            {/* Detalles del albarán */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-gray-800">Detalles del Albarán</h3>
                <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-200 text-black">
                        <tr>
                            <th className="border p-2 text-left">Descripción</th>
                            <th className="border p-2 text-center">Cantidad</th>
                            <th className="border p-2 text-right">Precio Unitario</th>
                            <th className="border p-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineas.length > 0 ? (
                            lineas.map((linea) => (
                                <tr key={linea.id} className="odd:bg-gray-100 even:bg-white text-black">
                                    <td className="border p-2">{linea.descripcion}</td>
                                    <td className="border p-2 text-center">{linea.cantidad}</td>
                                    <td className="border p-2 text-right">{linea.precioUnitario.toFixed(2)} €</td>
                                    <td className="border p-2 text-right">{(linea.cantidad * linea.precioUnitario).toFixed(2)} €</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border p-2 text-center text-gray-500">
                                    No hay líneas en este albarán.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* Resumen de totales */}
            <section className="text-right">
                <div className="space-y-2">
                    <p className="text-sm text-gray-600"><strong>Total sin IVA:</strong> {totalSinIVA.toFixed(2)} €</p>
                    <p className="text-sm text-gray-600"><strong>IVA (21%):</strong> {totalIVA.toFixed(2)} €</p>
                    <p className="text-lg font-bold text-gray-800"><strong>Total con IVA:</strong> {totalConIVA.toFixed(2)} €</p>
                </div>
            </section>

            {/* Condiciones del albarán */}
            <section className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">Condiciones</h3>
                <p className="text-sm text-gray-600">{albaran?.condiciones || "No hay condiciones específicas."}</p>
            </section>

            {/* Pie de página */}
            <footer className="mt-8 text-center text-xs text-gray-500">
                <p>Este documento es un albarán oficial emitido por Mi Empresa S.L.</p>
            </footer>
        </div>
    );
};

export default AlbaranDetalle;