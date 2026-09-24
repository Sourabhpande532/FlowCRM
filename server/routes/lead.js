const express = require("express");
const app = express.Router();
const SalesLead = require("../model/SalesLead");
const SalesAgent = require("../model/SalesAgent");
const { default: mongoose } = require("mongoose");

const createNewLead = async (newLead) => {
  try {
    const lead = new SalesLead(newLead);
    const saved = await lead.save();
    return saved;
  } catch (error) {
    console.error("Sever error.`/lead`", error.message);
  }
};

app.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const { name, source, salesAgent, timeToClose } = payload;
    if (!name || !source || !salesAgent || !timeToClose) {
      return res.status(400).json({
        error:
          "Invalid input: name/source/salesAgent/timeToClose/ missing required fields.",
      });
    }
    const agent = await SalesAgent.findById(salesAgent);
    if (!agent)
      return res
        .status(404)
        .json({ error: `Sales agent with ID '${salesAgent} not found.'` });

    const leads = await createNewLead(payload);
    await leads.populate({ path: "salesAgent", select: "name email" });
    res.status(201).json({ success: true, data: { leads } });
  } catch (error) {
    console.error("Internal server error /lead", error);
    res.status(500).json({
      success: false,
      message: "Internal server error create lead.",
      error: error.message,
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const { salesAgent, status, tags, source, sortBy, sortDir } = req.query;
    const filter = {};
    if (salesAgent) filter.salesAgent = salesAgent;
    // Validate status only if user passed status
    if (status) {
      const validStatus = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Closed",
      ];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid input: 'status' must be one of ['New','Contacted','Qualified','Proposal Sent','Closed'].",
        });
      }
      filter.status = status;
    }
    if (source) filter.source = source;
    if (tags)
      filter.tags = { $all: Array.isArray(tags) ? tags : tags.split(",") };
    let query = SalesLead.find(filter).populate({
      path: "salesAgent",
      select: "name email",
    });

    if (sortBy) {
      const dir = sortDir === "desc" ? -1 : 1;
      const sortObj = {};
      sortObj[sortBy] = dir;
      query = query.sort(sortObj);
    }
    // return a real promis .exec()
    const leads = await query.exec();
    res.json({ success: true, data: { leads } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const lead = await SalesLead.findById(req.params.id).populate({
      path: "salesAgent",
      select: "name email",
    });
    if (!lead)
      return res
        .status(404)
        .json({ error: `Lead with ID ${req.params.id} not found` });
    res.status(200).json({ success: true, data: { lead } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error /lead" });
  }
});

// UPDATE:
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `Invalid Lead ID '${id}'.` });
    }

    const lead = await SalesLead.findById(id);
    if (!lead)
      return res.status(404).json({ error: `Lead with ID '${id}' not found.` });
    if (updates.salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(updates.salesAgent)) {
        return res.status(400).json({
          error: `Invalid Sales Agent ID '${updates.salesAgent}'.`,
        });
      }
    }
    Object.assign(lead, updates);
    await lead.save();
    await lead.populate({ path: "salesAgent", select: "name" });
    res.status(200).json({ success: true, data: { lead } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error /lead/update" });
  }
});

// DELETE
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: `Lead with ID '${id}' not found.` });
    }
    const lead = await SalesLead.findByIdAndDelete(req.params.id);
    lead
      ? res
          .status(200)
          .json({ success: true, message: "Lead deleted successfully." })
      : res.json({
          success: false,
          error: `lead with Id ${req.params.id} not found.`,
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sever error /delete/lead" });
  }
});

module.exports = app;

/* NOTE: 
?tags=Follow-up return array && 1st conditio true o.w ?tags=Follow-up,High value 2nd condtion true. 
$all checks that a field contains all the values inside an array.
*/
