const express = require("express");
const multer = require("multer");
const pool = require("../db");
const path = require("path");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "song") {
      cb(null, "uploads/songs");
    } else {
      cb(null, "uploads/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ UPLOAD SONG ROUTE
router.post(
  "/upload",
  upload.fields([{ name: "song" }, { name: "image" }]),
  async (req, res) => {
    try {
      console.log("📥 Upload request received");

      const { title, artist, genre } = req.body;

      // ✅ SAFE LOGGING (inside function)
      console.log("Title:", title);
      console.log("Artist:", artist);
      console.log("Genre:", genre);

      const songFile = req.files.song[0].filename;
      const imageFile = req.files.image[0].filename;

      console.log("Song file:", songFile);
      console.log("Image file:", imageFile);

      const audioUrl = `http://localhost:5000/uploads/songs/${songFile}`;
      const imageUrl = `http://localhost:5000/uploads/images/${imageFile}`;

      const result = await pool.query(
        `INSERT INTO songs (title, artist, genre, audio_url, image_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, artist, genre, audioUrl, imageUrl]
      );

      console.log("✅ Song saved to database with ID:", result.rows[0].id);

      res.json({
        success: true,
        message: "Song uploaded successfully",
        song: result.rows[0],
      });

    } catch (err) {
      console.error("❌ Upload error:", err.message);
      res.status(500).json({
        success: false,
        message: "Song upload failed",
      });
    }
  }
);

// GET ALL SONGS
router.get("/", async (req, res) => {
  const songs = await pool.query("SELECT * FROM songs");
  res.json(songs.rows);
});

module.exports = router;
