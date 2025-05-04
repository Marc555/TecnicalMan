import React, { useState } from "react";

const TaskForm = ({ task, onClose, onSave }) => {
    const [titulo, setTitulo] = useState(task?.title || "");
    const [encargado, setEncargado] = useState(task?.encargado || "AMBOS");
    const [direccion, setDireccion] = useState(task?.direccion || "");
    const [estado, setEstado] = useState(task?.estado || "PENDIENTE");
    const [fechaHora, setFechaHora] = useState(
        task?.start ? new Date(task.start).toISOString().substring(0, 16) : ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedTask = {
            ...task,
            title: titulo,
            encargado,
            direccion,
            estado,
            start: new Date(fechaHora),
        };
        onSave(updatedTask);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-black rounded-lg p-6 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4">
                    {task ? "Editar Tarea" : "Crear Nueva Tarea"}
                </h2>
                <div className="mb-4">
                    <label className="block mb-2">Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Encargado</label>
                    <select
                        value={encargado}
                        onChange={(e) => setEncargado(e.target.value)}
                        className="w-full p-2 border rounded"
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
                    <label className="block mb-2">Estado</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="COMPLETADA">Completada</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Fecha y Hora</label>
                    <input
                        type="datetime-local"
                        value={fechaHora}
                        onChange={(e) => setFechaHora(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;