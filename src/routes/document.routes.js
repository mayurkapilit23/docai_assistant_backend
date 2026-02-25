import express from "express";
import pool from "../config/db.js";
import upload from "../middleware/upload.middleware.js";
import fs from "fs";
import path from "path";
const router = express.Router();

//Upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error:
          "Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT",
      });
    }



    const { filename, originalname, path, size, mimetype } = req.file;

    const result = await pool.query(
      `INSERT INTO documents 
       (filename, original_name, file_path, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [filename, originalname, path, size, mimetype]
    );

    res.status(201).json({
      message: "File uploaded successfully",
      document: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
});

//download document

router.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find document in DB
    const result = await pool.query(
      "SELECT * FROM documents WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    const document = result.rows[0];
    const filePath = path.resolve(document.file_path);

    // 2️⃣ Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found on server",
      });
    }

    // 3️⃣ Send file for download
    res.download(filePath, document.original_name);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Download failed",
    });
  }
});

//delete document

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find document
    const result = await pool.query(
      "SELECT * FROM documents WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Document not found",
      });
    }

    const document = result.rows[0];

    // 2️⃣ Delete file from server
    const filePath = path.resolve(document.file_path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3️⃣ Delete record from DB
    await pool.query("DELETE FROM documents WHERE id = $1", [id]);

    res.json({
      message: "Document deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Delete failed",
    });
  }
});

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