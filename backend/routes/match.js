import express from "express";
import { matchResume } from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { resume, job } = req.body;

  if (!resume || !job) {
    return res.status(400).json({
      error: "Missing resume or job"
    });
  }

  try {
    const result = await matchResume(resume, job);
    res.json(result);
  } catch (err) {
    console.error("MATCH ERROR:");
    console.error(err);
    console.error(err?.message);

    res.status(500).json({
      error: "Failed to analyze match",
      details: err?.message || "Unknown error"
    });
  }
});

export default router;
