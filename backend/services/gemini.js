import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing");
}

export async function matchResume(resume, job) {
  const prompt = `
You are a resume-job matching assistant.

Rules:
- Be conservative and realistic
- Missing required skills should significantly reduce score

Output ONLY valid JSON in this format:
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    }
  );

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`Gemini API error: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  throw new Error("No text output from Gemini");
}

const cleaned = text
  .replace(/```json/i, "")
  .replace(/```/g, "")
  .trim();

try {
  return JSON.parse(cleaned);
} catch (err) {
  console.error("RAW MODEL OUTPUT:");
  console.error(text);
  throw new Error("Model output was not valid JSON");
}

}
