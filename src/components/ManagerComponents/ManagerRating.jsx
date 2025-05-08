import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerRating = () => {
  const [allUser, setAllUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("managerToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/manager/allEmpName",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);
        if (res.data) {
          // Set full user list including _id and name
          setAllUser(res.data.onlyName);
        }
      } catch (err) {
        console.error("Error fetching employee names", err);
      }
    };

    const fetchHistory = async () => {
      const res = await axios.post(
        "http://localhost:3000/manager/getPerformance",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data) setHistory(res.data);
    };

    fetchData();
    fetchHistory();
  }, [token]);

  const handleSubmit = async () => {
    if (!selectedUserId || !rating) {
      return alert("Select employee and enter rating.");
    }

    try {
      await axios.post(
        "http://localhost:3000/manager/performance",
        {
          employeeId: selectedUserId,
          rating,
          feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Rating submitted!");
      setRating("");
      setFeedback("");
      setSelectedUserId("");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting rating.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Employee Performance Rating
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-1">Select Employee</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select --</option>
              {allUser.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Feedback</label>
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Optional"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Rating
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Previous Ratings</h3>
        {history.length === 0 ? (
          <p className="text-gray-500">No ratings submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="border p-4 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-bold">{item.userId?.name || "Unknown"}</p>
                  <p className="text-gray-600">
                    Feedback: {item.feedback || "N/A"}
                  </p>
                </div>
                <div className="text-blue-600 font-bold text-lg">
                  ⭐ {item.rating}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerRating;
