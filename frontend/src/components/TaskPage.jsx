import React, { useState } from "react";
import Calendar from "../page/Calendar";
import TaskForm from "../components/TaskForm";
import { tareaApi } from "../axios/tareaApi";

const TaskPage = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleTaskSelect = async (taskId) => {
        try {
            const task = await tareaApi.getById(taskId);
            setSelectedTask(task);
        } catch (error) {
            console.error("Error fetching task:", error.message);
        }
    };

    const handleCreateTask = (date) => {
        setSelectedTask({ fechaHora: date });
        setIsCreating(true);
    };

    const handleSaveTask = async (task) => {
        try {
            if (task.id) {
                await tareaApi.update(task.id, task);
            } else {
                await tareaApi.create(task);
            }
            setSelectedTask(null);
            setIsCreating(false);
        } catch (error) {
            console.error("Error saving task:", error.message);
        }
    };

    const handleCancel = () => {
        setSelectedTask(null);
        setIsCreating(false);
    };

    return (
        <div className="p-4">
            {selectedTask || isCreating ? (
                <TaskForm
                    initialTask={selectedTask}
                    onSave={handleSaveTask}
                    onCancel={handleCancel}
                />
            ) : (
                <Calendar
                    onTaskSelect={handleTaskSelect}
                    onCreateTask={handleCreateTask}
                />
            )}
        </div>
    );
};

export default TaskPage;