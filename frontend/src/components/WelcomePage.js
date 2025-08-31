
import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to Smart Expense Tracker 💰</h1>
      <p className="welcome-desc">
        Track, analyze, and manage your expenses with AI-powered insights.<br />
        Add your expenses, view analytics, and get help from your personal chatbot assistant.
      </p>
      <button className="welcome-btn" onClick={() => navigate("/add")}>➕ Add Expense</button>
      <button className="welcome-btn" onClick={() => navigate("/analyse")}>📊 Analyse Expenses</button>
    </div>
  );
}

export default WelcomePage;
