const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ================= LIKE / UNLIKE ================= */
router.post("/", async (req, res) => {
  const { userId, songId } = req.body;

  try {
    const existing = await pool.query(
      "SELECT 1 FROM likes WHERE user_id=$1 AND song_id=$2",
      [userId, songId]
    );

    if (existing.rows.length > 0) {
      // UNLIKE
      await pool.query(
        "DELETE FROM likes WHERE user_id=$1 AND song_id=$2",
        [userId, songId]
      );

      return res.json({ liked: false });
    } else {
      // LIKE
      await pool.query(
        "INSERT INTO likes (user_id, song_id) VALUES ($1, $2)",
        [userId, songId]
      );

      return res.json({ liked: true });
    }
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Like failed" });
  }
});

/* ================= CHECK LIKE STATUS ================= */
router.get("/check", async (req, res) => {
  const { userId, songId } = req.query;

  try {
    const result = await pool.query(
      "SELECT 1 FROM likes WHERE user_id=$1 AND song_id=$2",
      [userId, songId]
    );

    res.json({ liked: result.rows.length > 0 });
  } catch (err) {
    console.error("Check like error:", err);
    res.status(500).json({ error: "Check failed" });
  }
});

/* ================= USER'S LIKED SONGS ================= */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT s.*
      FROM likes l
      JOIN songs s ON s.id = l.song_id
      WHERE l.user_id = $1
      ORDER BY l.id DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch liked songs error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

module.exports = router;
