import "./App.css";
import { useState } from "react";
import TextAreaBlock from "./Components/textAreaBlock";
import OutputBox from "./components/OutputBox";
import api from "./api";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import jsPDF from "jspdf";

function BuilderPage() {
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState(null);
  const [uploadedText, setUploadedText] = useState("");

  const handleGenerate = async () => {
    setResult("Generating resume...");

    try {
      const res = await api.post("/build-resume", {
        education,
        experience,
        projects,
        skills,
      });

      setResult(res.data.resume);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }
  };

  const downloadResume = () => {
    const fullResume = `
EDUCATION
${education}

EXPERIENCE
${experience}

PROJECTS
${projects}

SKILLS
${skills}
`;

    const blob = new Blob([fullResume.trim()], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Resume Builder</h2>

      {!mode && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={() => setMode("upload")}>Upload your resume (PDF)</button>
          <button onClick={() => setMode("fill")}>Fill out your resume</button>
        </div>
      )}

      <label
        style={{
          display: "inline-block",
          padding: "8px 12px",
          background: "#e5e7eb",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        Upload your resume (PDF)
        <input
          type="file"
          accept="application/pdf"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async function () {
              const typedarray = new Uint8Array(this.result);
              const pdf = await pdfjsLib.getDocument(typedarray).promise;

              let fullText = "";

              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map((item) => item.str).join(" ") + "\n\n";
              }

              setUploadedText(fullText);
            };
            reader.readAsArrayBuffer(file);
          }}
        />
      </label>

      <textarea
        value={uploadedText}
        onChange={(e) => setUploadedText(e.target.value)}
        rows={20}
        style={{ width: "100%", marginBottom: 16 }}
      />

      <TextAreaBlock label="Education" value={education} onChange={setEducation} />
      <TextAreaBlock label="Experience" value={experience} onChange={setExperience} />
      <TextAreaBlock label="Projects" value={projects} onChange={setProjects} />
      <TextAreaBlock label="Skills" value={skills} onChange={setSkills} />

      <button onClick={handleGenerate}>Generate Resume</button>

      <OutputBox title="Generated Resume" content={result} />

      {result && (
        <button onClick={downloadResume} style={{ marginTop: 10 }}>
          Download Resume
        </button>
      )}
    </div>
  );
}

function TailorPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");

  const handleTailor = async () => {
    setResult("Tailoring resume...");

    try {
      const res = await api.post("/tailor-resume", {
        resume,
        job,
      });

      const data = res.data;

      const summary = data?.tailored_summary ?? "";
      const bullets = Array.isArray(data?.tailored_bullets) ? data.tailored_bullets : [];
      const keywords = Array.isArray(data?.keywords_to_add) ? data.keywords_to_add : [];
      const missing = Array.isArray(data?.missing_skills) ? data.missing_skills : [];

      const formatted = [
        "TAILORED SUMMARY",
        summary || "(none)",
        "",
        "REWRITTEN BULLETS",
        bullets.length
          ? bullets
              .map(
                (b, idx) =>
                  `${idx + 1}. ORIGINAL: ${b.original}\n   REWRITE:  ${b.rewritten}`
              )
              .join("\n\n")
          : "(none)",
        "",
        "KEYWORDS TO ADD",
        keywords.length ? keywords.join(", ") : "(none)",
        "",
        "MISSING SKILLS",
        missing.length ? missing.join(", ") : "(none)",
      ].join("\n");

      setResult(formatted);
    } catch (err) {
      console.error(err);
      setResult("Error tailoring resume.");
    }
  };

  return (
    <div>
      <h2>Resume Tailor</h2>

      <TextAreaBlock label="Your Current Resume" value={resume} onChange={setResume} />

      <TextAreaBlock label="Job Posting" value={job} onChange={setJob} />

      <button onClick={handleTailor}>Tailor Resume</button>

      <OutputBox title="Tailored Resume" content={result} />
    </div>
  );
}

function MatchPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");

  const handleMatch = async () => {
    setResult("Analyzing match...");

    try {
      const res = await api.post("/match-resume", {
        resume,
        job,
      });

      const data = res.data;

      setResult(
        `Match Score: ${data.score}\n\nMissing Skills:\n${data.missing_skills.join("\n")}`
      );
    } catch (err) {
      setResult("Error analyzing match.");
    }
  };

  return (
    <div>
      <h2>Resume ↔ Job Match</h2>

      <TextAreaBlock label="Your Resume" value={resume} onChange={setResume} />

      <TextAreaBlock label="Job Posting" value={job} onChange={setJob} />

      <button onClick={handleMatch}>Analyze Match</button>

      <OutputBox title="Match Analysis" content={result} />
    </div>
  );
}

function App() {
  const [page, setPage] = useState("builder");

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Job Hunt Assistant</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button onClick={() => setPage("builder")}>Builder</button>
        <button onClick={() => setPage("tailor")}>Tailor</button>
        <button onClick={() => setPage("match")}>Match</button>
      </div>

      {page === "builder" && <BuilderPage />}
      {page === "tailor" && <TailorPage />}
      {page === "match" && <MatchPage />}
    </div>
  );
}

export default App;
