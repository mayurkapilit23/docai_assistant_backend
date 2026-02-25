import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Insert test document
router.post("/test-insert", async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO documents 
       (filename, original_name, file_path, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        "test.pdf",
        "original_test.pdf",
        "/uploads/test.pdf",
        1024,
        "application/pdf",
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Insert failed" });
  }
});

// Fetch all documents
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM documents ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;