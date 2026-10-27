const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Welcome endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "In-Memory CRUD API is running"
  });
});

// Register user routes
app.use("/api/users", userRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Centralized error handler must be registered last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
