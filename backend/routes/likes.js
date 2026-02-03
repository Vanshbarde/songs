const express = require("express");
const router = express.Router();
const pool = require("../db");

// TOGGLE LIKE
router.post("/", async (req, res) => {
  const { userId, songId } = req.body;

  const check = await pool.query(
    "SELECT * FROM likes WHERE user_id=$1 AND song_id=$2",
    [userId, songId]
  );

  if (check.rows.length > 0) {
    // UNLIKE
    await pool.query(
      "DELETE FROM likes WHERE user_id=$1 AND song_id=$2",
      [userId, songId]
    );

    await pool.query(
      "UPDATE songs SET like_count = like_count - 1 WHERE id=$1",
      [songId]
    );

    return res.json({ liked: false });
  } else {
    // LIKE
    await pool.query(
      "INSERT INTO likes (user_id, song_id) VALUES ($1,$2)",
      [userId, songId]
    );

    await pool.query(
      "UPDATE songs SET like_count = like_count + 1 WHERE id=$1",
      [songId]
    );

    return res.json({ liked: true });
  }
});

// CHECK LIKE STATUS
router.get("/:songId/:userId", async (req, res) => {
  const { songId, userId } = req.params;

  const result = await pool.query(
    "SELECT * FROM likes WHERE user_id=$1 AND song_id=$2",
    [userId, songId]
  );

  res.json({ liked: result.rows.length > 0 });
});

// USER LIKED SONGS
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query(`
    SELECT s.*
    FROM songs s
    JOIN likes l ON s.id = l.song_id
    WHERE l.user_id = $1
  `, [userId]);

  res.json(result.rows);
});

module.exports = router;
