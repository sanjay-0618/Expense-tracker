

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://fqrvf7zq-3000.inc1.devtunnels.ms/",
    "*"
]}}, supports_credentials=True)

# -------------------------------
# Route: Home
# -------------------------------
@app.route("/")
def home():
    return "Expense Tracker Backend is running!"



# Azure OpenAI Config (from .env)
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

import os

# Azure OpenAI client
client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
)

# In-memory expenses store
expenses = []

# -------------------------------
# Route: Add Expense
# -------------------------------
@app.route("/add_expense", methods=["POST"])
def add_expense():
    data = request.json
    if not data or "category" not in data or "amount" not in data:
        return jsonify({"error": "Invalid data"}), 400

    category = data["category"]
    amount = float(data["amount"])
    date = data.get("date")


    # Normalize date to YYYY-MM-DD for comparison
    def get_date_only(dt):
        if not dt:
            return None
        return dt[:10]  # works for ISO strings

    date_only = get_date_only(date)
    for expense in expenses:
        if expense["category"] == category and get_date_only(expense.get("date")) == date_only:
            expense["amount"] += amount
            return jsonify({"message": "Expense added to existing category and date", "expense": expense}), 201

    # If not found, create new
    expense = {
        "category": category,
        "amount": amount,
        "date": date  # optional
    }
    expenses.append(expense)
    return jsonify({"message": "Expense added", "expense": expense}), 201


# -------------------------------
# Route: Get Expenses
# -------------------------------
@app.route("/get_expenses", methods=["GET"])
def get_expenses():
    return jsonify(expenses), 200   # return as list directly


# -------------------------------
# Route: Chat with AI
# -------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message or not user_message.strip():
        return jsonify({"reply": "please ask anything"}), 200

    try:
        # Summarize expenses for the AI as JSON for better parsing
        import json
        if expenses:
            expense_json = json.dumps(expenses)
            expense_summary = (
                "Here is the user's expense data as a JSON array. "
                "Each item has 'category', 'amount', and 'date'. "
                "Use this data to answer the user's questions accurately.\n"
                f"Expenses: {expense_json}"
            )
        else:
            expense_summary = "The user has not entered any expenses yet."

        system_prompt = (
            "You are a finance assistant helping with budgeting. "
            f"{expense_summary}"
        )

        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_completion_tokens=200
        )

        ai_reply = response.choices[0].message.content
        return jsonify({"reply": ai_reply}), 200

    except Exception as e:
        import traceback
        print("Error in /chat route:", e)
        traceback.print_exc()
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
