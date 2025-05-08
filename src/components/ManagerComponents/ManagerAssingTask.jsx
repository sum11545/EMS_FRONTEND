import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ManagerAssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    empId: "",
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("managerToken");
        const res = await axios.post(
          "http://localhost:3000/manager/allEmpName",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(res.data.onlyName || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employees");
      }
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem("managerToken");
      const res = await axios.get("http://localhost:3000/manager/getTask", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedTasks(res.data.data || []);
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const assignTask = async () => {
    try {
      const token = localStorage.getItem("managerToken");
      await axios.post("http://localhost:3000/manager/assingTask", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task assigned successfully!");
      setTaskData({ empId: "", title: "", description: "", dueDate: "" });

      // Refresh assigned tasks
      const res = await axios.get("http://localhost:3000/manager/getTask", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedTasks(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer autoClose={2000} position="top-right" />
      <div className="bg-white rounded-xl shadow-lg max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Assign Task to Employee
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold block mb-1">Select Employee</label>
            <select
              name="empId"
              value={taskData.empId}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold block mb-1">Task Title</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter task title"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold block mb-1">Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border p-2 rounded"
              placeholder="Enter task description"
            />
          </div>
        </div>

        <button
          onClick={assignTask}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Assign Task
        </button>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-blue-800">
          Previously Assigned Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Employee</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Due Date</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="py-2 px-4">
                    {task.assignedTo?.name || "Unknown"}
                  </td>
                  <td className="py-2 px-4">{task.title}</td>
                  <td className="py-2 px-4">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{task.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerAssignTask;
