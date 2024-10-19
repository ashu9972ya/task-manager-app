import React, { useState } from "react";
import {
  Icon340CheckboxUnchecked,
  IconBxPencil,
  IconCheck,
  IconTrash,
} from "@/assets/svg";

type Task = {
  id: number;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
};

type Props = {
  tasks: Task[];
  editTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  toggleComplete: (id: number) => void;
};

const TaskList = ({ tasks, editTask, deleteTask, toggleComplete }: Props) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    priority: "low" as Task["priority"],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editingTask) {
      editTask({
        ...editingTask,
        ...formValues,
      });
      setEditingTask(null); 
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormValues({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null); 
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <ul className="space-y-2 w-full">
      {sortedTasks.map((task) => (
        <li
          key={task.id}
          className={`flex flex-col p-2 border rounded ${
            task.priority === "high"
              ? "bg-red-600"
              : task.priority === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          } `}
        >
          {editingTask?.id === task.id ? (
            <div>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                className=" w-full mb-2 px-3 py-2 border outline-none rounded-md shadow-sm"
                placeholder="Enter task title"
              />
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                className=" mb-2 w-full px-2 py-2 border outline-none rounded-md shadow-sm"
                placeholder="Enter task description"
              />
              <select
                name="priority"
                value={formValues.priority}
                onChange={handleInputChange}
                className="mb-2  px-2 py-2 border rounded-md shadow-sm"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSave}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <span
                  className={`text-lg font-semibold flex-grow ${
                    task.completed ? "line-through " : ""
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="px-1 py-1 rounded hover:bg-gray-200"
                  >
                    {task.completed ? (
                      <IconCheck />
                    ) : (
                      <Icon340CheckboxUnchecked />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditClick(task)}
                    className="px-1 py-1 rounded hover:bg-gray-200"
                  >
                    <IconBxPencil />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-1 py-1 rounded hover:bg-gray-200"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
              {task.description && (
                <p
                  className={`text-gray-100 mt-1 text-sm ${
                    task.completed ? "line-through " : ""
                  }`}
                >
                  {task.description}
                </p>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
