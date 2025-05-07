import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminManageManagers = () => {
  const [managers, setManagers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://ems-backend-0xxx.onrender.com/admin/allManager",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setManagers(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch managers");
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `https://ems-backend-0xxx.onrender.com/admin/deleteManager`,
        { managerId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Manager deleted");
      fetchManagers();
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed");
    }
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `https://ems-backend-0xxx.onrender.com/admin/verifyManager`,
        { managerId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Manager verified");
      fetchManagers();
    } catch (err) {
      toast.error("Verification failed");
      console.error(err);
    }
  };

  const openEditModal = (manager) => {
    setEditingId(manager._id); // ✅ This is important
    setName(manager.name || "");
    setEmail(manager.email || "");
    setDepartment(manager.department || "");
    setContactNo(manager.contactNo || "");
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const res = await axios.post(
        `https://ems-backend-0xxx.onrender.com/admin/editManager`,
        {
          managerId: editingId,
          name: name,
          email: email,
          contact: contactNo,
          department: department,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res);
      toast.success("Manager updated!");
      setEditModalOpen(false);
      fetchManagers();
    } catch (err) {
      toast.error("Failed to update manager");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Manage Managers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Department</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="py-2 px-4">{m.name}</td>
                <td className="py-2 px-4">{m.email}</td>
                <td className="py-2 px-4">{m.department}</td>
                <td className="py-2 px-4">
                  {m.isVerfied ? "Verified" : "Pending"}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  {!m.isVerfied && (
                    <button
                      onClick={() => handleVerify(m._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openEditModal(m)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h2 className="text-xl mb-4 font-bold">Edit Manager</h2>
              <form onSubmit={handleEditSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="Contact Number"
                  className="w-full mb-4 p-2 border rounded"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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

export default AdminManageManagers;
