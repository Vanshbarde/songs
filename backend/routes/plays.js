const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { user_id, song_id } = req.body;

    if (!song_id) {
      return res.status(400).json({ error: "song_id required" });
    }

    // 1️⃣ Save play history
    await db.query(
      "INSERT INTO play_history (user_id, song_id) VALUES ($1, $2)",
      [user_id || null, song_id]
    );

    // 2️⃣ Update cached count
    await db.query(
      `
      UPDATE songs
      SET play_count = (
        SELECT COUNT(*) FROM play_history WHERE song_id = $1
      )
      WHERE id = $1
      `,
      [song_id]
    );

    res.json({ message: "Play tracked" });
  } catch (err) {
    console.error("Play tracking failed:", err);
    res.status(500).json({ error: "Play tracking failed" });
  }
});

module.exports = router;
