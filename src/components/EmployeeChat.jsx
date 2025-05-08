import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000/chat");

const EmployeeChat = ({ department, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.emit("joinDepartmentRoom", department);

    socket.on("loadPreviousMessages", (oldMessages) => {
      setMessages(oldMessages);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("loadPreviousMessages");
      socket.disconnect();
    };
  }, [department]);

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", {
        department,
        message,
        sender: username,
      });
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl border rounded shadow-lg bg-white mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-3">
        💬 Team Chat - {department}
      </h2>
      <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <span className="font-semibold">{msg.sender}:</span>{" "}
            <span>{msg.message}</span>
            <div className="text-xs text-gray-500">
              {new Date(msg.time).toLocaleTimeString()}
            </div>
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EmployeeChat;
