import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es"; // Idioma español
import { tareaApi } from "../axios/tareaApi";
import TaskModal from "./TaskModal";
import TaskForm from "./TaskForm"; // Importar el formulario

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [tasksForDay, setTasksForDay] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false); // Estado para mostrar el formulario
    const [selectedTask, setSelectedTask] = useState(null); // Tarea seleccionada para editar

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await tareaApi.getAll();

                // Procesar las tareas para el calendario
                const parsedEvents = tasks.map((task) => {
                    let startDate;

                    // Manejar el formato de fecha
                    if (typeof task.fechaHora === "string") {
                        // Si es un string ISO, convertirlo directamente
                        startDate = new Date(task.fechaHora);
                    } else if (Array.isArray(task.fechaHora) && task.fechaHora.length === 5) {
                        // Si es un array con [year, month, day, hour, minute]
                        const [year, month, day, hour, minute] = task.fechaHora;
                        startDate = new Date(year, month - 1, day, hour, minute);
                    } else {
                        console.warn("Formato de fecha incorrecto para la tarea:", task);
                        return null; // Ignorar tareas con formato inválido
                    }

                    return {
                        id: task.id,
                        title: task.titulo || "Sin título",
                        encargado: task.encargado || "No asignado",
                        direccion: task.direccion || "Sin dirección",
                        estado: task.estado || "PENDIENTE",
                        start: startDate,
                        color: task.estado === "COMPLETADA" ? "green" : "blue",
                    };
                }).filter(event => event !== null); // Filtrar eventos nulos

                console.log("Lista completa de tareas del calendario:", parsedEvents); // Registrar todas las tareas
                setEvents(parsedEvents);
            } catch (error) {
                console.error("Error al obtener las tareas:", error.message);
            }
        };

        fetchTasks();
    }, []);

    const handleDateClick = (info) => {
        const date = info.dateStr; // Fecha seleccionada
        setSelectedDate(date);

        const tasksForSelectedDate = events.filter((event) => {
            const eventDate = event.start.toISOString().split("T")[0];
            return eventDate === date;
        });

        setTasksForDay(tasksForSelectedDate);
        setIsModalOpen(true);
    };

    const handleEventClick = (info) => {
        const clickedDate = info.event.start.toISOString().split("T")[0]; // Obtener la fecha del evento clicado

        const tasksForSelectedDate = events.filter((event) => {
            const eventDate = event.start.toISOString().split("T")[0];
            return eventDate === clickedDate; // Filtrar todas las tareas del día
        });

        setSelectedDate(clickedDate); // Establecer la fecha seleccionada
        setTasksForDay(tasksForSelectedDate); // Mostrar todas las tareas del día
        setIsModalOpen(true); // Abrir el modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTasksForDay([]);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedTask(null);
    };

    const handleSaveTask = (updatedTask) => {
        // Actualizar la lista de eventos
        setEvents((prevEvents) =>
            updatedTask.id
                ? prevEvents.map((event) =>
                    event.id === updatedTask.id ? { ...event, ...updatedTask } : event
                )
                : [...prevEvents, updatedTask]
        );

        // Si la tarea editada pertenece a la fecha seleccionada, actualizar tasksForDay
        if (
            updatedTask.start &&
            updatedTask.start.toISOString().split("T")[0] === selectedDate
        ) {
            setTasksForDay((prevTasks) =>
                updatedTask.id
                    ? prevTasks.map((task) =>
                        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
                    )
                    : [...prevTasks, updatedTask]
            );
        }

        closeForm(); // Cerrar el formulario
    };

    return (
        <div className="p-4 bg-white text-black rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Calendario de Tareas</h1>
                <button
                    onClick={() => {
                        setSelectedTask(null); // Crear nueva tarea
                        setIsFormOpen(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Añadir Nueva Tarea
                </button>
            </div>
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
                />
            </div>

            {isModalOpen && (
                <TaskModal
                    date={selectedDate}
                    tasks={tasksForDay}
                    onClose={closeModal}
                    onEditTask={(task) => {
                        setSelectedTask(task);
                        setIsFormOpen(true);
                    }}
                />
            )}

            {isFormOpen && (
                <TaskForm
                    task={selectedTask} // Pasar la tarea seleccionada al formulario
                    onClose={closeForm}
                    onSave={handleSaveTask}
                />
            )}
        </div>
    );
};

export default Calendar;