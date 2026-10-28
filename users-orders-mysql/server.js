require("dotenv").config();

const express = require("express");
const db = require("./db");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Users and Orders API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log("MySQL connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
