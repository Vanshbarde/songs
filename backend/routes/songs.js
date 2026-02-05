const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= UPLOAD SONG ================= */
router.post(
  "/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, artist, genre, duration } = req.body;

      // ✅ Validate duration here
      const durationNum = Number(duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        return res.status(400).json({ error: "Invalid duration" });
      }

      if (!req.files.audio || !req.files.image) {
        return res.status(400).json({ error: "Files missing" });
      }

      const audioUrl = `/uploads/${req.files.audio[0].filename}`;
      const imageUrl = `/uploads/${req.files.image[0].filename}`;

      const result = await pool.query(
        `INSERT INTO songs 
         (title, artist, genre, audio_url, image_url, duration)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, artist, genre, audioUrl, imageUrl, durationNum] // use validated number
      );

      const song = result.rows[0];

      console.log("🎵 NEW SONG UPLOADED");
      console.log("ID       :", song.id);
      console.log("Title    :", song.title);
      console.log("Artist   :", song.artist);
      console.log("Genre    :", song.genre);
      console.log("Duration :", song.duration);
      console.log("---------------------------");

      res.json({
        message: "Song uploaded successfully",
        song
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);


/* ================= GET SONGS ================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

module.exports = router;
