import express from "express";
import { buildResume } from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { education, experience, projects, skills } = req.body;

  if (!education && !experience && !projects && !skills) {
    return res.status(400).json({ error: "Missing resume sections" });
  }

  try {
    const result = await buildResume({ education, experience, projects, skills });
    return res.json(result); // { latex: "..." }
  } catch (err) {
    console.error("BUILD ERROR:", err);
    return res.status(500).json({
      error: "Failed to build resume",
      details: err?.message || "Unknown error",
    });
  }
});

export default router;
