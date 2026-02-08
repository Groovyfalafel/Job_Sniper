import express from "express";
import { tailorResume } from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { resume, job } = req.body;

  if (!resume || !job) {
    return res.status(400).json({ error: "Missing resume or job" });
  }

  try {
    const result = await tailorResume(resume, job);
    return res.json(result);
  } catch (err) {
    console.error("TAILOR ERROR:", err);
    return res.status(500).json({
      error: "Failed to tailor resume",
      details: err?.message || "Unknown error",
    });
  }
});
router.get("/ping", (req, res) => res.json({ ok: true }));

export default router;
