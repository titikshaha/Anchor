import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Journal() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [entryId, setEntryId] = useState(null);
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    const fetchTodayEntry = async () => {
      try {
        const res = await axios.get("/entries/today");
        if (res.data && res.data.journal) {
          setText(res.data.journal);
          setEntryId(res.data._id);
          const now = new Date();
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          setEditable(now <= endOfDay);
        }
      } catch (err) {
        console.error("No existing journal entry for today.");
      }
    };

    fetchTodayEntry();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (entryId) {
        await axios.put(`/entries/${entryId}`, { journal: text });
        alert("Entry updated!");
      } else {
        await axios.post("/entries", { journal: text });
        alert("Entry saved!");
      }
    } catch (err) {
      console.error("Failed to save/update entry", err);
    }
  };

  return (
    <div className="home-container journal-page-wrapper">
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

    
  <form onSubmit={handleSubmit} className="journal-form">
    <div className="journal-paper">
      <textarea
        placeholder="Write your thoughts for the day..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!editable}
        maxLength={1000}
        className="journal-textarea"
      />
    </div>

    <div className="journal-buttons">
      {editable ? (
        <button type="submit">
          {entryId ? "Update Entry" : "Save Entry"}
        </button>
      ) : (
        <p>This journal entry is now locked for today.</p>
      )}
      <button type="button" onClick={() => navigate("/journal/view")}>
        View Past Entries
      </button>
    </div>
  </form>
</div>
  );
}