import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { facturaApi } from "../../axios/facturaApi";
import { clienteApi } from "../../axios/clienteApi";
import { lineaFacturaApi } from "../../axios/lineaFacturaApi";

const IVA = 0.21;

const FacturaForm = () => {
    const { id } = useParams(); // Obtener el ID de la factura desde la URL
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [condiciones, setCondiciones] = useState('');
    const [estado, setEstado] = useState('BORRADOR');
    const [idCliente, setIdCliente] = useState('');
    const [clientes, setClientes] = useState([]);
    const [lineas, setLineas] = useState([]);
    const [lineasEliminadas, setLineasEliminadas] = useState([]); // Estado para las líneas eliminadas
    const [nuevaLinea, setNuevaLinea] = useState({ id: null, descripcion: '', cantidad: 1, precioUnitario: 0 });
    const [editIndex, setEditIndex] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const totalSinIVA = lineas.reduce((acc, linea) => acc + linea.cantidad * linea.precioUnitario, 0);
    const totalIVA = totalSinIVA * IVA;
    const totalConIVA = totalSinIVA + totalIVA;

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await clienteApi.getAll();
                setClientes(data);
            } catch (error) {
                console.error("Error al obtener la lista de clientes:", error.message);
            }
        };

        const fetchFactura = async () => {
            if (id) {
                try {
                    const factura = await facturaApi.getById(id);

                    if (factura) {
                        setTitulo(factura.titulo);
                        setCondiciones(factura.condiciones);
                        setEstado(factura.estado);
                        setIdCliente(factura.idCliente);

                        // Cargar líneas de factura
                        const lineasFactura = await lineaFacturaApi.getAll();
                        const lineasFiltradas = lineasFactura.filter((linea) => linea.idFactura === parseInt(id));
                        setLineas(lineasFiltradas || []);
                    } else {
                        console.error(`Factura con ID ${id} no encontrada.`);
                    }
                } catch (error) {
                    console.error("Error al cargar la factura:", error.message);
                }
            }
        };

        fetchClientes();
        fetchFactura();
    }, [id]);

    const handleAddOrEditLinea = () => {
        if (editIndex !== null) {
            const updatedLineas = [...lineas];
            updatedLineas[editIndex] = nuevaLinea;
            setLineas(updatedLineas);
            setEditIndex(null);
        } else {
            setLineas([...lineas, nuevaLinea]);
        }
        setNuevaLinea({ id: null, descripcion: '', cantidad: 1, precioUnitario: 0 });
        setShowPopup(false);
    };

    const handleEditLinea = (index) => {
        setNuevaLinea(lineas[index]);
        setEditIndex(index);
        setShowPopup(true);
    };

    const handleDeleteLinea = (index) => {
        const lineaAEliminar = lineas[index];
        const updatedLineas = lineas.filter((_, i) => i !== index);

        // Si la línea tiene un ID, significa que ya existe en el backend y debe eliminarse
        if (lineaAEliminar.id) {
            setLineasEliminadas([...lineasEliminadas, lineaAEliminar]);
        }

        setLineas(updatedLineas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const facturaData = {
                id: id || undefined,
                titulo,
                condiciones,
                estado,
                idCliente,
            };

            let savedFactura;
            if (id) {
                savedFactura = await facturaApi.update(id, facturaData);
            } else {
                savedFactura = await facturaApi.create(facturaData);
            }

            // Guardar las líneas de factura
            await Promise.all(
                lineas.map(async (linea) => {
                    if (linea.id) {
                        // Actualizar línea existente
                        return await lineaFacturaApi.update(linea.id, {
                            ...linea,
                            idFactura: savedFactura.id,
                        });
                    } else {
                        // Crear nueva línea
                        return await lineaFacturaApi.create({
                            ...linea,
                            idFactura: savedFactura.id,
                        });
                    }
                })
            );

            // Eliminar las líneas marcadas para eliminación
            await Promise.all(
                lineasEliminadas.map(async (linea) => {
                    return await lineaFacturaApi.delete(linea.id);
                })
            );

            // Redirigir a la lista de facturas
            navigate('/facturas');
        } catch (error) {
            console.error("Error al guardar la factura:", error.message);
        }
    };

    const handleBackToList = () => {
        navigate('/facturas');
    };

    const selectedCliente = clientes.find((cliente) => cliente.id === parseInt(idCliente));

    return (
        <div className="bg-white text-black p-8 max-w-7xl mx-auto">
            <div className="flex items-center mb-4">
                <button onClick={handleBackToList} className="text-xl text-orange-500 hover:text-orange-600">
                    &#8592; Volver a la lista
                </button>
            </div>

            <h2 className="text-3xl font-bold mb-6">{id ? "Editar" : "Nueva"} Factura</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block font-semibold text-lg mb-2">Cliente</label>
                        <select
                            value={idCliente}
                            onChange={(e) => setIdCliente(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                        {selectedCliente && (
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
                                <p><strong>NIF:</strong> {selectedCliente.nif}</p>
                                <p><strong>Dirección:</strong> {selectedCliente.direccion}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-lg mb-2">Título</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-black"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-semibold text-lg mb-2">Condiciones</label>
                    <textarea
                        value={condiciones}
                        onChange={(e) => setCondiciones(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                        rows="4"
                    />
                </div>

                <div>
                    <label className="block font-semibold text-lg mb-2">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-black"
                    >
                        <option value="BORRADOR">Borrador</option>
                        <option value="ENVIADO">Enviado</option>
                        <option value="ACEPTADO">Aceptado</option>
                        <option value="RECHAZADO">Rechazado</option>
                    </select>
                </div>

                <div className="my-8">
                    <h3 className="text-xl font-semibold mb-4">Líneas de Factura</h3>
                    <table className="w-full border border-gray-300 text-sm text-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Descripción</th>
                                <th className="border p-2 text-center">Cantidad</th>
                                <th className="border p-2 text-right">Precio Unitario</th>
                                <th className="border p-2 text-right">Total</th>
                                <th className="border p-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineas.map((linea, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{linea.descripcion}</td>
                                    <td className="border p-2 text-center">{linea.cantidad}</td>
                                    <td className="border p-2 text-right">{linea.precioUnitario.toFixed(2)} €</td>
                                    <td className="border p-2 text-right">
                                        {(linea.cantidad * linea.precioUnitario).toFixed(2)} €
                                    </td>
                                    <td className="border p-2 text-center flex justify-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditLinea(idx)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLinea(idx)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            onClick={() => setShowPopup(true)}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                            Añadir línea
                        </button>
                    </div>
                </div>

                <div className="text-right font-semibold space-y-1">
                    <p>Total sin IVA: {totalSinIVA.toFixed(2)} €</p>
                    <p>IVA (21%): {totalIVA.toFixed(2)} €</p>
                    <p>Total con IVA: {totalConIVA.toFixed(2)} €</p>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                    >
                        Guardar Factura
                    </button>
                </div>
            </form>

            {/* Popup para añadir o editar línea */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white text-black p-6 rounded shadow-lg w-96 space-y-4">
                        <h3 className="text-lg font-semibold">
                            {editIndex !== null ? "Editar línea" : "Nueva línea"}
                        </h3>
                        <div>
                            <label>Descripción:</label>
                            <input
                                type="text"
                                value={nuevaLinea.descripcion}
                                onChange={(e) => setNuevaLinea({ ...nuevaLinea, descripcion: e.target.value })}
                                className="w-full border rounded p-2 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                min="1"
                                value={nuevaLinea.cantidad}
                                onChange={(e) => setNuevaLinea({ ...nuevaLinea, cantidad: parseInt(e.target.value) || 1 })}
                                className="w-full border rounded p-2 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label>Precio Unitario:</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={nuevaLinea.precioUnitario}
                                onChange={(e) => setNuevaLinea({ ...nuevaLinea, precioUnitario: parseFloat(e.target.value) || 0 })}
                                className="w-full border rounded p-2 text-black"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleAddOrEditLinea}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                {editIndex !== null ? "Guardar cambios" : "Añadir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacturaForm;