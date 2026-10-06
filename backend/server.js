const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Traffic Violation API is running"
    });
});

// Backend connection test
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend connection is working"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});