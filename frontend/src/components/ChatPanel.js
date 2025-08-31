
import React, { useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import "./ChatPanel.css";

function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMsg = { role: "Me", content: input };
    setMessages([...messages, newMsg]);
    setInput("");

  const res = await axios.post(`${BACKEND_URL}/chat`, {
      message: input,
    });

    const reply = { role: "Zekyn", content: res.data.reply };
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div className="chat-panel">
      <h3 className="chat-title">💬 Zekyn-AI Assistant</h3>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <p key={i}><b>{msg.role}:</b> {msg.content}</p>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPanel;
