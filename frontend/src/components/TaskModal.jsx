import React from "react";
import { tareaApi } from "../axios/tareaApi";

const TaskModal = ({ date, tasks, onClose, onEditTask, refreshData }) => {
    const formatDate = (dateStr) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('es-ES', options);
    };

    const handleDelete = async (taskId) => {
        try {
            await tareaApi.delete(taskId);
            refreshData();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tareas para {formatDate(date)}</h2>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tasks.length === 0 ? (
                        <p className="text-center py-4">No hay tareas para este día</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className="border rounded p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold">{task.title}</h3>
                                        <p className="text-sm">{task.encargado}</p>
                                        <p className="text-sm text-gray-600">
                                            {task.extendedProps?.hora || '--:--'}
                                        </p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded ${task.estado === 'COMPLETADA'
                                            ? 'bg-green-100 text-green-800'
                                            : task.estado === 'PENDIENTE'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : task.estado === 'CANCELADA'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {task.estado}
                                        </span>
                                        <p className="text-sm">{task.direccion}</p>
                                        <p className="text-sm">{task.descripcion}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEditTask(task)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;