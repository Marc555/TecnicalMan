import React, { useState, useEffect } from "react";

const TaskForm = ({ task, onClose, onSave }) => {
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [encargado, setEncargado] = useState("AMBOS");
    const [direccion, setDireccion] = useState("");
    const [estado, setEstado] = useState("PENDIENTE");
    const [fechaHora, setFechaHora] = useState("");

    useEffect(() => {
        if (task) {
            // Inicializar los valores de la tarea
            setTitulo(task.titulo || task.title || "");
            setDescripcion(task.descripcion || "");
            setEncargado(task.encargado || "AMBOS");
            setDireccion(task.direccion || "");
            setEstado(task.estado || "PENDIENTE");

            // Formatear la fecha/hora al formato requerido por datetime-local y sumar 2 horas
            if (task.fechaHora || task.start) {
                const date = new Date(task.fechaHora || task.start);

                // Sumar 2 horas manualmente
                date.setHours(date.getHours() + 2);

                const formattedDate = date.toISOString().slice(0, 16); // Extraer yyyy-MM-ddThh:mm
                setFechaHora(formattedDate);
            } else {
                setFechaHora("");
            }
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Asumir que fechaHora ya está en UTC o en el formato correcto
        const fechaUTC = new Date(fechaHora);

        const taskData = {
            ...(task || {}),
            titulo,
            descripcion,
            encargado,
            direccion,
            estado,
            fechaHora: fechaUTC.toISOString()
        };

        try {
            await onSave(taskData);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">
                    {task?.id ? "Editar Tarea" : "Crear Nueva Tarea"}
                </h2>

                <div className="mb-4">
                    <label className="block mb-2">Título *</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Descripcion</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Encargado *</label>
                    <select
                        value={encargado}
                        onChange={(e) => setEncargado(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="JAIME">Jaime</option>
                        <option value="PABLO">Pablo</option>
                        <option value="AMBOS">Ambos</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Dirección</label>
                    <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Estado *</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="COMPLETADA">Completada</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Fecha y Hora *</label>
                    <input
                        type="datetime-local"
                        value={fechaHora}
                        onChange={(e) => setFechaHora(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {task?.id ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;