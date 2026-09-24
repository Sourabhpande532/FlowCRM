const express = require("express");
const app = express.Router();
const SalesAgent = require("../model/SalesAgent");

const addAgentToDatabase = async (newAgent) => {
  try {
    const agent = new SalesAgent(newAgent);
    const saved = await agent.save();
    return saved;
  } catch (error) {
    console.error(error);
  }
};

app.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const { name, email } = payload;
    if (!name || !email) {
      return res.status(400).json({
        error: "Invalid input: 'email' must be a valid email address.",
      });
    }
    const isExits = await SalesAgent.findOne({ email });
    if (isExits) {
      return res.status(409).json({
        error: `Sales agent with email '${isExits.email}' already exists.`,
      });
    }
    const agent = await addAgentToDatabase(payload);
    if (agent) {
      res.status(201).json({
        success: true,
        message: "Added a new sales agent",
        data: { agent },
      });
    } else {
      res.status(400).json({ success: false, message: "SalesAgent not found" });
    }
  } catch (error) {
    console.error("Internal error agent", error.message);
    res.status(500).json({
      success: false,
      message: "Agend data creation failed.",
      error: error.message,
    });
  }
});

const getAllAgents = async () => {
  try {
    const agent = await SalesAgent.find().select("name email");
    return agent;
  } catch (error) {
    console.error("Failed to fetched agents", error.message);
  }
};

app.get("/", async (req, res) => {
  try {
    const agents = await getAllAgents();
    if (agents.length != 0) {
      res.status(200).json({ success: true, data: { agents } });
    } else {
      res
        .status(404)
        .json({ success: false, message: "SalesAgent not found." });
    }
  } catch (error) {
    console.error("Failed To fetched data!", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch agents", error: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await SalesAgent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to delete agent", error: error.message });
  }
});

module.exports = app;
