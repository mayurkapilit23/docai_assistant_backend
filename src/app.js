import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import documentRoutes from "./routes/document.routes.js";

dotenv.config();

const app = express();

// Middlewares
// app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
}));
app.use(express.json());

app.use("/api/documents", documentRoutes);

// Routes
app.use("/api", healthRoutes);
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});
export default app;
