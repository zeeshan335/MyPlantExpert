const express = require("express");
const router = express.Router();
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// PlantNet API configuration
const PLANTNET_API_KEY =
  process.env.PLANTNET_API_KEY || "2b10uEQerzfzYhDqwdMRyatu";
const PLANTNET_API_URL = `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`;

router.post("/identify", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log(
      "Received image:",
      req.file.originalname,
      req.file.size,
      "bytes"
    );

    // Create FormData for PlantNet API
    const formData = new FormData();
    formData.append("images", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("organs", "auto");

    // Call PlantNet API
    const response = await fetch(PLANTNET_API_URL, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PlantNet API error:", response.status, errorText);
      throw new Error(`PlantNet API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Plant identified successfully");
    res.json(data);
  } catch (error) {
    console.error("Plant identification error:", error);
    res.status(500).json({
      error: "Failed to identify plant",
      message: error.message,
    });
  }
});

module.exports = router;
