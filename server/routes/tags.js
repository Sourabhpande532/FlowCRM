const express = require("express");
const app = express.Router();
const Tags = require("../model/Tags");

app.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Tag name is required" });
    const exists = await Tags.findOne({ name });
    if (exists)
      return res.status(409).json({ error: `Tag '${name}' already exits ` });
    const tag = new Tags({ name });
    await tag.save();
    res.status(201).json({ success: true, data: { tag } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const tags = await Tags.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: { tags } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sever error" });
  }
});

module.exports = app;
