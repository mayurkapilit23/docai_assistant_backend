import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import documentRoutes from "./routes/document.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/documents", documentRoutes);

// Routes
app.use("/api", healthRoutes);

export default app;
