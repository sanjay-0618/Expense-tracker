
import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import "./AnalyseExpense.css";

function AnalyseExpense() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`${BACKEND_URL}/get_expenses`).then((res) => {
      setExpenses(res.data);
    });
  }, []);



  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("today"); // default to today
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Get all unique categories from all expenses
    const allCategories = Array.from(new Set(expenses.map(e => e.category)));

    useEffect(() => {
      filterExpenses();
    }, [expenses, filter, categoryFilter]);

    const filterExpenses = () => {
      const now = new Date();
      let filtered = [];

      if (filter === "today") {
        filtered = expenses.filter(
          (e) => new Date(e.date).toDateString() === now.toDateString()
        );
      } else if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        filtered = expenses.filter((e) => new Date(e.date) >= weekAgo);
      } else if (filter === "month") {
        filtered = expenses.filter(
          (e) => new Date(e.date).getMonth() === now.getMonth() &&
                 new Date(e.date).getFullYear() === now.getFullYear()
        );
      }

      if (categoryFilter !== "all") {
        filtered = filtered.filter(e => e.category === categoryFilter);
      }

      setFilteredExpenses(filtered);
    };

    // Calculate total amount for filtered expenses
    const totalAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);


    // Group filteredExpenses by category and sum the amounts for the bar chart
    const chartData = Object.values(filteredExpenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { category: curr.category, amount: 0 };
      }
      acc[curr.category].amount += Number(curr.amount);
      return acc;
    }, {}));


    // Display label for current filter
    const filterLabel = filter === "today" ? "Today's Expenses"
      : filter === "week" ? "Weekly Expenses"
      : "Monthly Expenses";

    return (
      <div className="analyse-container">
        <h2 className="analyse-title">Expense Analysis</h2>

        <div className="current-filter-label" style={{ color: '#1e3c72', fontWeight: 600, marginBottom: 8, fontSize: '1.1rem' }}>{filterLabel}</div>

        {/* Filter buttons */}
        <div className="filter-options">
          <button onClick={() => setFilter("today")}>Today</button>
          <button onClick={() => setFilter("week")}>This Week</button>
          <button onClick={() => setFilter("month")}>This Month</button>
        </div>

        {/* Chart */}
        <div className="analyse-chart">
          <BarChart width={500} height={300} data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Table of filtered expenses with category filter and total */}
        <div className="expense-table">
          <div className="expense-table-header">
            <h3>Detailed Expenses ({filter})</h3>
            <div className="categorise-by">
              <label htmlFor="category-select">Categorise by: </label>
              <select
                id="category-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="all">All</option>
                {allCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="expense-table-total">
            Total: <span>₹{totalAmount}</span>
          </div>
          {filteredExpenses.length === 0 ? (
            <p>No expenses found for this period.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e, i) => (
                  <tr key={i}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.category}</td>
                    <td>{e.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back Button */}
        <button
          className="add-expense-btn"
          style={{ marginTop: 24, background: "#eee", color: "#222" }}
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    );
  }

  export default AnalyseExpense;
