const express = require("express");
const cors = require("cors");
const path = require("path");

const songRoutes = require("./routes/songs");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/songs", songRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
