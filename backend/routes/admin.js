const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/analytics", async (req, res) => {
  const songs = await pool.query("SELECT * FROM songs");

  const mostPlayed = await pool.query(
    "SELECT * FROM songs ORDER BY play_count DESC LIMIT 1"
  );

  const mostLiked = await pool.query(
    "SELECT * FROM songs ORDER BY like_count DESC LIMIT 1"
  );

  res.json({
    mostPlayed: mostPlayed.rows[0],
    mostLiked: mostLiked.rows[0],
    allSongs: songs.rows
  });
});

module.exports = router;
