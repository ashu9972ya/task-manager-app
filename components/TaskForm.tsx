import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@/assets/svg";

// Zod schema for form validation
const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(50, "Title must be less than 50 characters"),
  description: z
    .string()
    .min(1, {message : "Description is required"})
    .max(200, "Description must be less than 200 characters") // Added description validation
    .optional(),
  priority: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Invalid priority selected" }),
  }),
});

type TaskFormSchema = z.infer<typeof taskSchema>;

type Props = {
  addTask: (task: Omit<TaskFormSchema, "id"> & { completed: boolean }) => void;
};

const TaskForm = ({ addTask }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormSchema) => {
    addTask({ ...data, completed: false });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mb-4">
      <div>
        <input
          id="title"
          {...register("title")}
          placeholder="Enter task title"
          className={`w-full px-3 py-2 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Enter task description"
          className={`w-full px-3 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <select
          id="priority"
          {...register("priority")}
          className={`w-full px-3 py-2 border ${
            errors.priority ? "border-red-500" : "border-gray-300"
          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {errors.priority && (
          <p className="mt-2 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>

      <div className="flex justify-center items-center">
        <button
          type="submit"
          className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-500"
        >
          <div>Add Task</div>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
