const express = require("express");
const router = express.Router();
const db = require("../db");

// OVERVIEW
router.get("/overview", async (req, res) => {
  const users = await db.query("SELECT COUNT(*) FROM users");
  const songs = await db.query("SELECT COUNT(*) FROM songs");
  const plays = await db.query("SELECT COUNT(*) FROM play_history");

  res.json({
    total_users: users.rows[0].count,
    total_songs: songs.rows[0].count,
    total_plays: plays.rows[0].count
  });
});


router.get("/songs", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        title,
        genre,
        play_count,
        like_count
      FROM songs
      ORDER BY play_count DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics failed" });
  }
});

  

// MOST PLAYED SONG
router.get("/most-played", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT title, play_count
      FROM songs
      ORDER BY play_count DESC
      LIMIT 1
    `);

    res.json(result.rows[0] || null);

  } catch (err) {
    console.error("Most played error:", err);
    res.status(500).json({ error: "Analytics failed" });
  }
});

module.exports = router;
