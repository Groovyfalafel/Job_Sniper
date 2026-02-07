import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// ✅ IMPORTANT: NO "models/" PREFIX HERE
const MODEL = "gemini-2.5-flash";

const url =
  `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

const prompt = `
SYSTEM INSTRUCTIONS (STRICT):
- You MUST return ONLY raw JSON.
- Do NOT include markdown, comments, or explanations.
- Do NOT wrap the output in \`\`\`.
- If you violate the format, the response is invalid.

SCORING RULES:
- score MUST be an integer between 0 and 100.
- If 2 or more REQUIRED skills are missing → score < 50.
- If exactly 1 commonly expected skill is missing → score between 55 and 70.
- If no required skills are missing → score >= 75.

DEFINITIONS:
- missing_skills = concrete technical tools or technologies explicitly required (e.g. Git, Docker, SQL).
- missing_keywords = job-relevant terms not found verbatim in the resume but implied by the role.

OUTPUT FORMAT (EXACT):
{
  "score": number,
  "missing_skills": string[],
  "missing_keywords": string[]
}

RESUME:
Bachelor of Computer Science, University of Windsor (2022–2026)
Software Engineering Intern, TechNova
- Developed REST APIs using Node.js and Express
- Worked with React frontend components

JOB POSTING:
Junior Software Developer with experience in JavaScript, React, and Node.js.
Experience with REST APIs and Git is required.
`;


async function run() {
  const res = await fetch(url, {
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

  });

  const raw = await res.text();

  if (!res.ok) {
    console.error("HTTP ERROR:", res.status, res.statusText);
    console.error("RAW RESPONSE:");
    console.error(raw);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("FAILED TO PARSE JSON");
    console.error("RAW RESPONSE:");
    console.error(raw);
    process.exit(1);
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("NO MODEL OUTPUT");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("\n=== AI OUTPUT ===\n");
  console.log(text);
}

run();
