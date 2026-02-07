import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// ✅ IMPORTANT: NO "models/" PREFIX HERE
const MODEL = "gemini-2.5-flash";

const url =
  `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

const prompt = `
You are a resume-job matching assistant.

You will receive:
1) A resume
2) A job posting

Your task:
- Evaluate how well the resume matches the job posting.
- Be conservative and realistic in scoring.
- If multiple major required skills are missing, score below 50.
- If only one commonly expected skill is missing, score between 55 and 70.


Output ONLY valid JSON in this exact format:
{
  "score": number,
  "missing_skills": [],
  "missing_keywords": []
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
