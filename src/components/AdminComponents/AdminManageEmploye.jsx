import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    contact: "",
    basesalary: "",
  });

  const token = localStorage.getItem("adminToken");

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/allEmployee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);

      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openEditModal = (emp) => {
    setSelectedEmployee(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      contact: emp.contact,
      basesalary: emp.basesalary,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        "http://localhost:3000/admin/editEmployee",
        { employeeId: selectedEmployee, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Employee updated");
      setEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    alert("Are you sure you want to delete this employee?");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `http://localhost:3000/admin/deletEmployee`,
        {
          employeeId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (err) {
      console.log(err);

      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        Manage Employees
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Contact</th>
              <th className="py-2 px-4 text-left">Salary</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="py-2 px-4">{emp.name}</td>
                <td className="py-2 px-4">{emp.email}</td>
                <td className="py-2 px-4">{emp.department}</td>
                <td className="py-2 px-4">{emp.contact}</td>
                <td className="py-2 px-4">₹{emp.basesalary}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(emp)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-96">
              <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact No"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={form.basesalary}
                  onChange={(e) =>
                    setForm({ ...form, basesalary: e.target.value })
                  }
                  className="w-full mb-4 p-2 border rounded"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageEmployees;
