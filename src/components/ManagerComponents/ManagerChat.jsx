import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat"); // shared /chat namespace

const ManagerChat = ({ department, username = "Manager" }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join department room and listen for messages
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

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        department,
        message: input,
        sender: username,
      });
      setInput("");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-3">Team Chat - {department}</h2>

      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50 mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender}</strong>:{" "}
            <span
              className={
                msg.message.includes(`@${username}`)
                  ? "bg-yellow-100 font-medium px-1 rounded"
                  : ""
              }
            >
              {msg.message}
            </span>
            <br />
            <small className="text-gray-500">
              {new Date(msg.time).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ManagerChat;
