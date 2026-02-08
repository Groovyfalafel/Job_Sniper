import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!API_KEY) throw new Error("❌ GEMINI_API_KEY is missing");

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  const raw = await response.text();
  if (!response.ok) throw new Error(`Gemini API error: ${raw}`);

  const data = JSON.parse(raw);
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text output from Gemini");

  const cleaned = text.replace(/```json/i, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function matchResume(resume, job) {
  const prompt = `
You are a resume-job matching assistant.

Output ONLY valid JSON:
{
  "score": number,
  "missing_skills": [],
  "missing_keywords": []
}

RESUME:
${resume}

JOB POSTING:
${job}
`;
  return callGemini(prompt);
}

export async function tailorResume(resume, job) {
  const prompt = `
You are a professional resume editor.

Hard rules:
- DO NOT invent experience/tools/degrees/projects not present in resume.
- You MAY reword/reorder/emphasize what already exists.
- If job requires skills not in resume, do NOT add them; list them as missing.

Output ONLY valid JSON:
{
  "tailored_summary": "string",
  "tailored_bullets": [
    { "original": "string", "rewritten": "string" }
  ],
  "keywords_to_add": ["string"],
  "missing_skills": ["string"]
}

RESUME:
${resume}

JOB POSTING:
${job}
`;
  return callGemini(prompt);
}
