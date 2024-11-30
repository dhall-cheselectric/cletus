// src/components/Chat.tsx

import React, { useState } from "react";
import { FaHome, FaCog, FaInfoCircle } from "react-icons/fa"; // Example icons

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat pane
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Send the input to the backend and get the response
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      // Extract the data from the response
      const data = await response.json();

      // Add the bot's response to the chat pane
      const botMessage: Message = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle errors and display a fallback message
      const errorMessage: Message = {
        sender: "bot",
        text: "Something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar shared-gradient">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <FaHome className="sidebar-icon" /> Home
          </li>
          <li className="sidebar-item">
            <FaCog className="sidebar-icon" /> Settings
          </li>
          <li className="sidebar-item">
            <FaInfoCircle className="sidebar-icon" /> About
          </li>
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="main-area">
        {/* Header */}
        <div className="header shared-gradient">
          <img
            src="/src/assets/chesapeake-electric-logo.png"
            alt="Chesapeake Electric Logo"
            className="header-logo"
          />
        </div>

        {/* Message Pane */}
        <div className="message-pane">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Bubble */}
        <div className="input-bubble">
          <div className="input-bubble-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
