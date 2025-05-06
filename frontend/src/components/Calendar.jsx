import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { tareaApi } from "../axios/tareaApi";
import TaskModal from "./TaskModal";
import TaskForm from "./TaskForm";

const parseTaskDate = (dateValue) => {
    if (!dateValue) return new Date();

    if (typeof dateValue === "string") {
        return new Date(dateValue);
    }

    if (Array.isArray(dateValue)) {
        return new Date(
            dateValue[0],
            dateValue[1] - 1,
            dateValue[2],
            dateValue[3],
            dateValue[4]
        );
    }

    if (typeof dateValue === "number") {
        // Intenta como segundos primero, luego como milisegundos
        const dateFromSeconds = new Date(dateValue * 1000);
        if (!isNaN(dateFromSeconds.getTime())) {
            return dateFromSeconds;
        }
        return new Date(dateValue);
    }

    console.warn("Formato de fecha no soportado:", dateValue);
    return new Date(); // Valor por defecto
};

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [tasksForDay, setTasksForDay] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const tasks = await tareaApi.getAll();

            const parsedEvents = tasks.map((task) => {
                const startDate = parseTaskDate(task.fechaHora);

                if (isNaN(startDate.getTime())) {
                    console.warn("Fecha inválida para la tarea:", task);
                    return null;
                }

                return {
                    id: task.id,
                    title: task.titulo || "Sin título",
                    encargado: task.encargado,
                    direccion: task.direccion,
                    estado: task.estado,
                    start: startDate,
                    color: task.estado === "COMPLETADA" ? "green" : "blue",
                    extendedProps: {
                        hora: startDate.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }),
                        fechaCompleta: startDate.toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }
                };
            }).filter(event => event !== null);

            setEvents(parsedEvents);

            // Actualizar tareas del día seleccionado si existe
            if (selectedDate) {
                const updatedTasksForDay = parsedEvents.filter(event => {
                    const eventDate = event.start.toISOString().split("T")[0];
                    return eventDate === selectedDate;
                });
                setTasksForDay(updatedTasksForDay);
            }
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDateClick = (info) => {
        const date = info.dateStr;
        setSelectedDate(date);

        const tasksForSelectedDate = events.filter((event) => {
            const eventDate = event.start.toISOString().split("T")[0];
            return eventDate === date;
        });

        setTasksForDay(tasksForSelectedDate);
        setIsModalOpen(true);
    };

    const handleEventClick = (info) => {
        const clickedDate = info.event.start.toISOString().split("T")[0];
        const tasksForSelectedDate = events.filter((event) => {
            const eventDate = event.start.toISOString().split("T")[0];
            return eventDate === clickedDate;
        });

        setSelectedDate(clickedDate);
        setTasksForDay(tasksForSelectedDate);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = async (taskData) => {
        try {
            await (taskData.id
                ? tareaApi.update(taskData.id, taskData)
                : tareaApi.create(taskData));

            await fetchTasks();
            closeForm();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <div className="p-4 bg-white text-black rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Calendario de Tareas</h1>
                <button
                    onClick={() => {
                        setSelectedTask(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    {isLoading ? "Cargando..." : "Añadir Nueva Tarea"}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Cargando calendario...</div>
            ) : (
                <div className="calendar-container">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        locales={[esLocale]}
                        locale="es"
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        height="auto"
                        contentHeight="auto"
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                    />
                </div>
            )}

            {isModalOpen && (
                <TaskModal
                    key={selectedDate} // Fuerza recreación al cambiar fecha
                    date={selectedDate}
                    tasks={tasksForDay}
                    onClose={closeModal}
                    onEditTask={(task) => {
                        setSelectedTask(task);
                        setIsFormOpen(true);
                    }}
                    refreshData={fetchTasks}
                />
            )}

            {isFormOpen && (
                <TaskForm
                    task={selectedTask}
                    onClose={closeForm}
                    onSave={handleSaveTask}
                />
            )}
        </div>
    );
};

export default Calendar;