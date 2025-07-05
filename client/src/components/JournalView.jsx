import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./JournalView.css";
export default function JournalView() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("/entries");
        setEntries(res.data);
      } catch (err) {
        console.error("Failed to fetch past journal entries", err);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="journal-view-container">
      <h2 className="journal-view-title">Your Journal History</h2>
      <div className="space-y-6">
        {entries.length === 0 ? (
          <p className="text-gray-500 italic">No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className="journal-entry-card">
              <div className="journal-entry-date">
                {new Date(entry.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </div>
              <p className="journal-entry-text">{entry.journal}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
