import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from sentiment import analyze_sentiment
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import io
from flask import send_file
# import base64
from bson import ObjectId
import pandas as pd
import calendar
from flask_cors import CORS

load_dotenv()  # Load variables from .env

app = Flask(__name__)
CORS(app)  # enable CORS so React frontend can call this API
emoji_map = {
     "Sad": 1,
     "Bored": 2,
     "Happy": 3,
    "Excited": 4,
     "Angry": 5
 }

# MongoDB connection string from environment
MONGO_URI = os.getenv("MONGO_URI")
PORT = int(os.getenv("PORT", 5001))

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["test"]  # Uses DB in URI or fallback
entries_collection = db["entries"]

@app.route("/", methods=["GET"])
def home():
    return "Flask app with MongoDB is running!", 200

@app.route("/heatmap/<user_id>", methods=["GET"])
def mood_heatmap(user_id):
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400
    entries = list(entries_collection.find({"user": user_obj_id}))
    
    if not entries:
        return jsonify({"error": "No entries found"}), 404

    # Process dates and moods
    df = pd.DataFrame(entries)
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df["score"] = df["mood"].map(emoji_map)

    # Create pivot table (day vs week number)
    df["week"] = pd.to_datetime(df["date"]).dt.isocalendar().week
    df["weekday"] = pd.to_datetime(df["date"]).dt.weekday
    heatmap_data = df.pivot_table(index="weekday", columns="week", values="score", aggfunc="mean")

    # Create heatmap plot
    plt.figure(figsize=(10, 5))
    sns.heatmap(heatmap_data, cmap="YlGnBu", cbar=True)
    plt.title("Mood Heatmap")
    plt.ylabel("Weekday")
    plt.xlabel("Week Number")

    # Save image to buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    plt.close()

    return send_file(buffer, mimetype="image/png")
@app.route("/save-mood", methods=["POST"])
def save_mood():
    data = request.get_json()
    user_id = data.get("user")
    mood = data.get("mood")

    if not user_id or not mood:
        return jsonify({"error": "Missing user ID or mood"}), 400
    
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    entry = {
        "user": user_obj_id,
        "mood": mood,
        "date": datetime.utcnow()
    }

    result = entries_collection.insert_one(entry)
    return jsonify({"message": "Mood saved!", "id": str(result.inserted_id)}), 201



if __name__ == "__main__":
    app.run(port=PORT, debug=True)
