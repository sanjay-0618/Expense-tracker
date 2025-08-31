import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import WelcomePage from "./components/WelcomePage";
import AddExpense from "./components/AddExpense";
import AnalyseExpense from "./components/AnalyseExpense";
import ChatPanel from "./components/ChatPanel";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/analyse" element={<AnalyseExpense />} />
          </Routes>
        </div>
        <ChatPanel />
      </div>
    </Router>
  );
}

export default App;
