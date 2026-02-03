const express = require("express");
const cors = require("cors");
const path = require("path");

// ✅ CREATE APP FIRST
const app = express();
const PORT = 5000;

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES
const songRoutes = require("./routes/songs");
const likesRoutes = require("./routes/likes");

app.use("/api/songs", songRoutes);
app.use("/api/likes", likesRoutes);

// ✅ SERVE UPLOADED FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
