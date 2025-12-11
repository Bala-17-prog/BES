const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ROUTES
const authRoute = require("./routes/auth");
const questionRoute = require("./routes/questions");
const resultRoute = require("./routes/results");
const userRoute = require("./routes/users");

const app = express();

// ----------------------------------
// CORS — ALLOW LOCAL + RENDER FRONTEND
// ----------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bes-4ufu.onrender.com", // ✅ your correct Render site URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ----------------------------------
// DATABASE CONNECTION
// ----------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ----------------------------------
// API ROUTES
// ----------------------------------
app.use("/api/auth", authRoute);
app.use("/api/questions", questionRoute);
app.use("/api/results", resultRoute);
app.use("/api/users", userRoute);

// ----------------------------------
// SERVE FRONTEND (VITE BUILD)
// ----------------------------------
const frontendPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(frontendPath));

// Handles refresh for routes like /login /admin /exam
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ----------------------------------
// START SERVER
// ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
