import dotenv from "dotenv";
import app from "./src/app.js";
import "./src/config/db.js"; // Initialize DB connection

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
