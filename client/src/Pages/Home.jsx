import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodForm from "../components/MoodForm";
import WaveDivider from "../components/WaveDivider";
import axios from "../api/axios"; // custom axios instance with JWT
import Checklist from "../components/Checklist";
import MoodRecommender from "../components/MoodRecommender";

const moods = [
  { label: "Happy", image: "/assets/moodhappy.jpg" },
  { label: "Sad", image: "/assets/moodsad.jpg" },
  { label: "Angry", image: "/assets/moodangry.jpg" },
  { label: "Bored", image: "/assets/moodbored.jpg" },
  { label: "Excited", image: "/assets/moodexcited.jpg" }
];

function Home() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem("selectedMood", JSON.stringify(mood)); // ✅ store full object
  };

  // 🔐 Check if today's entry exists
  useEffect(() => {
    const checkTodayEntry = async () => {
      try {
        const res = await axios.get("/entries/has-today-entry");
        setSubmitted(res.data.submitted);
      } catch (err) {
        console.error("Failed to check today's mood submission status:", err);
      }
    };
    checkTodayEntry();
  }, []);

  // 📦 Restore mood on refresh
  useEffect(() => {
    const fetchTodayMood = async () => {
      try {
        const res = await axios.get("/entries/today/mood");
        if (res.data.submitted && res.data.mood) {
          const moodObj = moods.find((m) => m.label === res.data.mood);
          if (moodObj) {
            setSelectedMood(moodObj);
            localStorage.setItem("selectedMood", JSON.stringify(moodObj)); // update localStorage just in case
          }
        } else {
          // fallback: try localStorage
          const stored = localStorage.getItem("selectedMood");
          if (stored) {
            setSelectedMood(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error("Failed to fetch today's mood data:", err);
        const stored = localStorage.getItem("selectedMood");
        if (stored) {
          setSelectedMood(JSON.parse(stored));
        }
      }
    };
    fetchTodayMood();
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            style={{ height: "50px", marginRight: "0px" }}
          />
          <span>ANCHOR</span>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate("/journal")}>Journal</button>
          <button onClick={() => navigate("/tracker")}>Tracker</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
      </nav>

      {/* 🎯 Mood Entry Section */}
      {!submitted ? (
        <div className="mood-section">
          <h2>How are you feeling today?</h2>
          <div className="mood-options">
            {moods.map((mood) => (
              <img
                key={mood.label}
                src={mood.image}
                alt={mood.label}
                className={`mood-image ${selectedMood?.label === mood.label ? "selected" : ""}`}
                onClick={() => handleMoodSelect(mood)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
          <MoodForm
            selectedMood={selectedMood}
            onSubmitSuccess={() => setSubmitted(true)}
            submitted={submitted}
          />
        </div>
      ) : (
        <div className="result-section">
          {selectedMood && (
            <>
              <h2>You’re feeling <span className="highlight">{selectedMood.label}</span> today</h2>
              <img
                src={selectedMood.image}
                alt={selectedMood.label}
                className="mood-result-image"
              />
            </>
          )}
          <h2>You’ve already submitted your mood today.</h2>
          <p>Come back tomorrow to log again!</p>
        </div>
      )}

      <WaveDivider />
      {selectedMood && <MoodRecommender mood={selectedMood.label} />}

      <Checklist />
    </div>
  );
}

export default Home;
