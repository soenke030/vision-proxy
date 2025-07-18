// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const client = new ImageAnnotatorClient({
  keyFilename: "./service-account.json"
});

app.post("/get-tags", upload.single("image"), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const [result] = await client.labelDetection({ image: { content: buffer } });
    const tags = result.labelAnnotations.map(x => x.description);
    res.json({ tags });
  } catch (err) {
    console.error("Fehler bei Vision API:", err);
    res.status(500).json({ error: "Vision API Fehler" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Vision-Proxy läuft auf Port", PORT));
