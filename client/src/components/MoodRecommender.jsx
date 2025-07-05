import React, { useEffect, useState, useRef } from "react";
import "./MoodRecommender.css"; // Make sure to create and import this CSS
import "./MoodForm";
const MoodRecommender = ({ mood }) => {
  const [songs, setSongs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
     const storedMood = localStorage.getItem("mood");
      const activeMood = mood || storedMood;

      if (!activeMood) return; // no mood available at all

    const fetchSongs = async () => {
      
      try {
        const res = await fetch(`http://localhost:5000/api/recommendations/${activeMood}`);
        const data = await res.json();
        setSongs(data);
        setCurrent(0);
        setIsPlaying(false);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      }
    };
    fetchSongs();
  }, [mood]);

  const togglePlay = () => {
    if (!songs[current]?.preview) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
const nextTrack = () => {
  if (songs.length > 0) {
    setTransitioning(true);
    setIsPlaying(false); // stop current track
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % songs.length);
      setTransitioning(false);
    }, 500); // duration matches the CSS animation
  }
};


  if (songs.length === 0 || songs[0]?.message) {
    return <p className="no-songs">No songs available right now.</p>;
  }

  const track = songs[current];

  return (
   <div className={`player-screen ${transitioning ? "transitioning" : ""}`}>
  <div
    className="player-bg"
    style={{ backgroundImage: `url(${track.cover})` }}
  />

  <div className="player-overlay">
    <div className="left-column">
      <h2 className="mood-title"> Mood: {mood || localStorage.getItem("mood")}</h2>

      <div className="album-info">
        <img
          src={track.cover}
          alt={track.title}
          className={`album-art ${isPlaying ? 'playing' : ''}${transitioning ? "transition-in" : ""}`}
        />
                  
          <div className={`album-info ${transitioning ? "transition-in" : ""}`}>
            <div className={`track-details ${transitioning ? "transition-in" : ""}`}>
              <h2>{track.title}</h2>
              <p>{track.artist}</p>
            </div>
          </div>
      </div>

      {track.preview ? (
        <audio ref={audioRef} src={track.preview} onEnded={nextTrack} />
      ) : null}

      <div className="player-controls">
        {/* {track.preview && (
          <button className="control-btn" onClick={togglePlay}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        )} */}

        <div className="button-row">
          <button className="next-btn" onClick={nextTrack}>Next ⏭</button>
          <a
            href={track.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="open-spotify"
          >
            Open on Spotify
          </a>
        </div>
      </div>


      {/* {!track.preview && (
        <a
          href={track.spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-spotify"
        >
          Open on Spotify
        </a>
      )} */}
    </div>

    <div className="right-column">
      <div className="track-queue">
        {songs.map((song, index) =>
          index !== current ? (
            <div className="queue-item" key={song.id}>
              <img src={song.cover} alt={song.title} />
              <div>
                <p className="queue-title">{song.title}</p>
                <p className="queue-artist">{song.artist}</p>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default MoodRecommender;
