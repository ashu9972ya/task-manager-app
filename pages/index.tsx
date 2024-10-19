import localFont from "next/font/local";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";

// Define Task Type
type Task = {
  id: number;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
};

type Props = {
  initialTasks: Task[];
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(initialTasks); // If no tasks in localStorage, use initialTasks
    }
  }, [initialTasks]);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: tasks.length + 1 };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Update localStorage after adding task
  };

  const editTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Update localStorage after editing task
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Update localStorage after deleting task
  };

  const toggleComplete = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Update localStorage after toggling task completion
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl font-[family-name:var(--font-geist-sans)]`}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2 py-1 border rounded shadow-sm outline-none"
        />
      </div>

      <div className="flex gap-10">
        <TaskForm addTask={addTask} />
        <TaskList
          tasks={filteredTasks}
          editTask={editTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const tasks: Task[] = [];

  return { props: { initialTasks: tasks } };
}
