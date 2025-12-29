const express = require("express");
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
  });
  
app.get("/info", (req, res) => {
res.json({ app: process.env.APP_NAME || "service" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
