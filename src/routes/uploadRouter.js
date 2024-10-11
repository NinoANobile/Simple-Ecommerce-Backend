// src/routes/uploadRouter.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "app_images", // Opcional: especifica una carpeta en Cloudinary
      public_id: req.file.originalname, // Opcional: asigna un ID público basado en el nombre original del archivo
    });
    res.json({ success: true, fileUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image:" + error.message,
    });
  }
});

module.exports = router;
