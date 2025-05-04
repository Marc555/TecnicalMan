import React from "react";

const TaskModal = ({ date, tasks, onClose, onEditTask }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">
                    Tareas para el {new Date(date).toLocaleDateString("es-ES")}
                </h2>
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        task && (
                            <div
                                key={task.id}
                                className="mb-4 p-4 bg-gray-100 rounded-lg shadow"
                            >
                                <h3 className="text-xl font-semibold">{task.title}</h3>
                                <p><strong>Encargado:</strong> {task.encargado}</p>
                                <p><strong>Dirección:</strong> {task.direccion}</p>
                                <p><strong>Estado:</strong> {task.estado}</p>
                                <p><strong>Fecha:</strong> {task.start && task.start.toLocaleString("es-ES")}</p>
                                <button
                                    onClick={() => onEditTask(task)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
                                >
                                    Editar
                                </button>
                            </div>
                        )
                    ))
                ) : (
                    <p className="text-gray-700">No hay tareas para este día.</p>
                )}
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default TaskModal;