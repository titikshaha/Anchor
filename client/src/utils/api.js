const API_BASE = "http://localhost:5000";
const FLASK_BASE = "http://localhost:5001";

export const fetchEntries = async (userId) =>
  fetch(`${API_BASE}/entries/${userId}`).then((res) => res.json());

export const createEntry = async (entry) =>
  fetch(`${API_BASE}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });

export const fetchChecklist = async (userId) =>
  fetch(`${API_BASE}/checklist/${userId}`).then((res) => res.json());

export const fetchHeatmap = (userId) =>
  `${FLASK_BASE}/heatmap/${userId}`;

export const fetchSongOfTheDay = async () =>
  fetch(`${FLASK_BASE}/song-of-the-day`).then((res) => res.json());
