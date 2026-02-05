const express = require("express");
const router = express.Router();
const pool = require("../db");


router.post("/", async (req, res) => {
  const { userId, songId } = req.body;

  console.log("❤️ LIKE TOGGLE REQUEST");
  console.log("User ID:", userId);
  console.log("Song ID:", songId);

  try {
    const existing = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND song_id = $2",
      [userId, songId]
    );

    console.log("Already liked?", existing.rows.length > 0);

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND song_id = $2",
        [userId, songId]
      );

      console.log("❌ LIKE REMOVED FROM DB");

      return res.json({ liked: false });
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, song_id) VALUES ($1, $2)",
        [userId, songId]
      );

      console.log("✅ LIKE STORED IN DB");

      return res.json({ liked: true });
    }
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ error: "Like failed" });
  }
});


// ✅ CHECK IF SONG IS LIKED
router.get("/check", async (req, res) => {
  const { userId, songId } = req.query;

  try {
    const result = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND song_id = $2",
      [userId, songId]
    );

    res.json({ liked: result.rows.length > 0 });
  } catch (err) {
    console.error("CHECK LIKE ERROR:", err);
    res.status(500).json({ error: "Failed to check like" });
  }
});


// 🔹 GET all liked songs for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.* 
       FROM songs s
       JOIN likes l ON s.id = l.song_id
       WHERE l.user_id = $1
       ORDER BY s.id DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to fetch liked songs:", err);
    res.status(500).json({ error: "Failed to fetch liked songs" });
  }
});



module.exports = router;




