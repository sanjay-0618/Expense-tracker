
import React, { useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { useNavigate } from "react-router-dom";
import "./AddExpense.css";



function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [extraCategory, setExtraCategory] = useState("");
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    let finalCategory = category === "Extra" ? extraCategory : category;
    if (!amount || !category || (category === "Extra" && !extraCategory) || !date) {
      setMessage("Please enter all values");
      return;
    }

    // Validate date: must be within last 7 days and not in the future, always accept today
    const enteredDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const minDate = new Date();
    minDate.setDate(today.getDate() - 7);
    minDate.setHours(0,0,0,0);
    // Accept today as valid (enteredDate <= today)
    const isToday = enteredDate.toDateString() === today.toDateString();
    if (enteredDate < minDate || (enteredDate > today && !isToday)) {
      setMessage("Date must be within the last 7 days and not in the future.");
      return;
    }

  await axios.post(`${BACKEND_URL}/add_expense`, {
      amount,
      category: finalCategory,
      date: enteredDate.toISOString()
    });
    setMessage("Added successfully");
  setAmount("");
  setCategory("");
  setExtraCategory("");
  setDate(todayStr);
  };

  return (
    <div className="add-expense-container">
      <h2 className="add-expense-title">Add Expense</h2>
      {message && (
        <div style={{ marginBottom: 12, color: message === "Added successfully" ? 'green' : 'red', fontWeight: 500 }}>
          {message}
        </div>
      )}
      <input
        className="add-expense-input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className="add-expense-input"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
        <option value="snacks">Snacks</option>
        <option value="essentials">Essentials</option>
        <option value="Extra">Extra</option>
      </select>
      {category === "Extra" && (
        <input
          className="add-expense-input"
          type="text"
          placeholder="Enter extra category"
          value={extraCategory}
          onChange={e => setExtraCategory(e.target.value)}
        />
      )}
      <input
        className="add-expense-input"
        type="date"
        value={date}
        max={new Date().toISOString().split('T')[0]}
        min={(function(){
          const d = new Date();
          d.setDate(d.getDate() - 7);
          return d.toISOString().split('T')[0];
        })()}
        onChange={e => setDate(e.target.value)}
      />
      <button className="add-expense-btn" onClick={handleSubmit}>Add</button>
      <button className="add-expense-btn" style={{marginTop: 16, background: '#eee', color: '#222'}} onClick={() => navigate("/")}>Back</button>
    </div>
  );
}

export default AddExpense;
