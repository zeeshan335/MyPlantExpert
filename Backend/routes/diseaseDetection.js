const express = require("express");
const router = express.Router();
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

const API_KEY = process.env.PLANTNET_API_KEY || "2b10uEQerzfzYhDqwdMRyatu";
const API_URL = "https://my-api.plantnet.org/v2/diseases/identify";

router.post("/detect", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const formData = new FormData();
    formData.append("images", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("organs", "auto");

    const response = await fetch(
      `${API_URL}?include-related-images=true&nb-results=3&no-reject=true&api-key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.log(text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Disease detection failed" });
  }
});

module.exports = router;
