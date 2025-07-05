import React, { useState } from "react";
import axios from "../api/axios"; // Includes JWT automatically

function MoodForm({ selectedMood, onSubmitSuccess, submitted }) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMood) {
      setError("Please select a mood before submitting.");
      return;
    }

    try {
      const res = await axios.post("/entries/mood", {
        mood: selectedMood.label
        // energy: 5,            // optional, if you want later
        // sentiment: "Neutral"  // optional
      });

      console.log("Mood entry saved:", res.data);
      onSubmitSuccess(); // tells Home.jsx to show confirmation
    } catch (err) {
      console.error(err);
      setError("Failed to save mood. Try again.");
    }
    localStorage.setItem("mood", selectedMood); // Store mood persistently

  };

  return (
    <form onSubmit={handleSubmit} className="mood-form">
      <button type="submit" className="submit-btn" disabled={submitted}>
  {submitted ? "Mood Submitted" : "Submit Mood"}
</button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

export default MoodForm;
