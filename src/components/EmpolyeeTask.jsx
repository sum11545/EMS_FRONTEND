import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const EmpolyeeTask = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://ems-backend-0xxx.onrender.com/assingTask",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setTasks(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const markAsComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://ems-backend-0xxx.onrender.com/completAssingTask`,
        { taskID: taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task marked as complete!");
      fetchTasks(); // refresh task list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer autoClose={2000} />
      <div className="bg-white max-w-5xl mx-auto p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          My Assigned Tasks
        </h2>
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="py-2 px-4">{task.title}</td>
                <td className="py-2 px-4">{task.description}</td>
                <td className="py-2 px-4">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{task.status}</td>
                <td className="py-2 px-4">
                  {task.status === "Pending" ? (
                    <button
                      onClick={() => markAsComplete(task._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <span className="text-green-700 font-medium">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpolyeeTask;
