import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔁 CHANGE THIS to test different prompts
const SYSTEM_PROMPT = `
You are a resume-job matching assistant.

You will receive:
1) A resume
2) A job posting

Your task:
- Evaluate how well the resume matches the job posting.
- Be conservative and realistic in scoring.
- If major required skills are missing, score below 50.

Scoring guidelines:
- 80–100: Most required skills and experience present
- 60–79: Partial match with some gaps
- 40–59: Significant gaps
- Below 40: Poor match

Output strictly in valid JSON using this structure:
{
  "score": number,
  "missing_skills": [],
  "missing_keywords": []
}
`;

// 🔁 CHANGE THIS to paste different test cases
const USER_INPUT = `
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
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_INPUT }
    ],
    temperature: 0.2
  });

  console.log("\n=== AI OUTPUT ===\n");
  console.log(response.choices[0].message.content);
}

run();
