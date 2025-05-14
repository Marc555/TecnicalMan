import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { facturaApi } from "../../axios/facturaApi";
import { lineaFacturaApi } from "../../axios/lineaFacturaApi";
import { clienteApi } from "../../axios/clienteApi";

const FacturaDetalle = () => {
    const { id } = useParams(); // Capturamos el ID de la factura desde la URL
    const navigate = useNavigate(); // Para redirigir al listado y a la edición
    const [factura, setFactura] = useState(null);
    const [lineas, setLineas] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar datos de la factura
                const facturaData = await facturaApi.getById(id);
                setFactura(facturaData);
                console.log("Factura cargada:", facturaData);

                // Cargar datos del cliente
                if (facturaData.idCliente) {
                    const clienteData = await clienteApi.getById(facturaData.idCliente);
                    setCliente(clienteData);
                    console.log("Cliente cargado:", clienteData);
                }

                // Cargar líneas de factura
                const lineasData = await lineaFacturaApi.getAll();
                const lineasFiltradas = lineasData.filter((linea) => linea.idFactura === parseInt(id));
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

    if (loading) return <div className="p-4 text-gray-800">Cargando factura...</div>;
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
                    onClick={() => navigate("/facturas")}
                    className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
                >
                    Volver al Listado
                </button>
                <button
                    onClick={() => navigate(`/facturas/editar/${id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Editar Factura
                </button>
            </div>

            {/* Encabezado de la factura */}
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Factura</h1>
                        <p className="text-sm text-gray-600">Número: {factura?.id}</p>
                        <p className="text-sm text-gray-600">Título: {factura?.titulo}</p>
                        {factura?.fechaEmitida ? (
                            <p className="text-sm text-gray-600">
                                Fecha de emisión: {new Date(factura.fechaEmitida).toLocaleDateString()}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">Fecha de emisión: No emitida</p>
                        )}
                        {factura?.fechaValidez && (
                            <p className="text-sm text-gray-600">
                                Validez hasta: {new Date(factura.fechaValidez).toLocaleDateString()}
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

            {/* Detalles de la factura */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-gray-800">Detalles de la Factura</h3>
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
                                    No hay líneas en esta factura.
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

            {/* Condiciones de la factura */}
            <section className="mt-8">
                <h3 className="text-lg font-bold text-gray-800">Condiciones</h3>
                <p className="text-sm text-gray-600">{factura?.condiciones || "No hay condiciones específicas."}</p>
            </section>

            {/* Pie de página */}
            <footer className="mt-8 text-center text-xs text-gray-500">
                <p>Este documento es una factura oficial emitida por Mi Empresa S.L.</p>
            </footer>
        </div>
    );
};

export default FacturaDetalle;