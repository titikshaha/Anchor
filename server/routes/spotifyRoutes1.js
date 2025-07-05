// server/routes/spotifyRoutes.js
const express = require("express");
const router = express.Router();
const { spotifyApi, authenticate } = require("../spotifyClient1");

const priorityArtists = [
  "Taylor Swift", "Little Mix" , "The Weeknd", "Ariana Grande", "Stray Kids",
  "Imagine Dragons", "Xdinary Heroes", "Billie Eilish", "Selena Gomez", "Arijit Singh" , "Pritam"
  , "Kendrick Lamar" , "Drake" , "Seventeen" , "Enhyphen", "Katseye"
];

function pickRandom(arr, n) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
}

router.get("/recommendations/:mood", async (req, res) => {
  const mood = req.params.mood.toLowerCase();
  console.log("🔍 Mood received:", mood);

  try {
    await authenticate();
    //console.log(" Spotify token set.");

    const prioritySongs = [];
    const selectedPriorityArtists = pickRandom(priorityArtists, 2);

    for (let i = 0; i < selectedPriorityArtists.length; i++) {
      const artist = selectedPriorityArtists[i];
      const query = `${mood} ${artist}`;
      const result = await spotifyApi.searchTracks(query, {
        limit: 5,
        market: "US"
      });

      //console.log(" Priority artist:", artist, "→", result.body.tracks.items.length, "tracks");

      const tracks = result.body.tracks.items;
      tracks.slice(0, 2).forEach(track => {
        prioritySongs.push({
          title: track.name,
          artist: track.artists[0].name,
          preview: track.preview_url || null,
          spotify_url: track.external_urls.spotify,
          cover: track.album.images[0]?.url,
          source: "priority"
        });
      });
    }

    //  RANDOM TRACKS
    const generalResult = await spotifyApi.searchTracks(mood, {
      limit: 50,
      market: "US"
    });
    const generalFiltered = generalResult.body.tracks.items.sort((a, b) => b.popularity - a.popularity);
   // console.log(" General result count:", generalFiltered.length);

    const randomTracks = pickRandom(generalFiltered, 5).map(track => ({
      title: track.name,
      artist: track.artists[0].name,
      preview: track.preview_url || null,
      spotify_url: track.external_urls.spotify,
      cover: track.album.images[0]?.url,
      source: "random"
    }));

    let finalList = [...prioritySongs];

    if (finalList.length < 7) {
      finalList = [...finalList, ...randomTracks];
    }

    finalList = finalList.slice(0, 7);
    //console.log(` Final recommendation list: ${finalList.length} tracks`);

    if (finalList.length === 0) {
      return res.json([{ message: "No tracks found. Try again later." }]);
    }

    res.json(finalList);

  } catch (err) {
    console.error("🚨 Error fetching recommendations:", err.message || err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
