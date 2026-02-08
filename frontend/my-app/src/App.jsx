import "./App.css";
import { useState } from "react";
import TextAreaBlock from "./Components/textAreaBlock";
import OutputBox from "./components/OutputBox";
import api from "./api";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function BuilderPage() {
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    setResult("Generating resume...");

    try {
      const res = await api.post("/build-resume", {
        education,
        experience,
        projects,
        skills,
      });

      setResult(res.data.latex); // ✅ LaTeX string
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }
  };

  const downloadResume = () => {
    const blob = new Blob([result || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.tex";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="home">
      <h2>Resume Builder</h2>

      <TextAreaBlock label="Education" value={education} onChange={setEducation} />
      <TextAreaBlock label="Experience" value={experience} onChange={setExperience} />
      <TextAreaBlock label="Projects" value={projects} onChange={setProjects} />
      <TextAreaBlock label="Skills" value={skills} onChange={setSkills} />

      <button onClick={handleGenerate}>Generate Resume</button>

      <OutputBox title="Generated Resume (LaTeX)" content={result} />

      {result && (
        <button onClick={downloadResume} style={{ marginTop: 12 }}>
          Download Resume
        </button>
      )}
    </div>
  );
}

/* ===================== TAILOR PAGE ===================== */
function TailorPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");

  const handleTailor = async () => {
    setResult("Tailoring resume...");

    try {
      const res = await api.post("/tailor-resume", { resume, job });
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
    <div className="home">
      <h2>Resume Tailor</h2>

      <TextAreaBlock label="Your Current Resume" value={resume} onChange={setResume} />
      <TextAreaBlock label="Job Posting" value={job} onChange={setJob} />

      <button onClick={handleTailor}>Tailor Resume</button>

      <OutputBox title="Tailored Resume" content={result} />
    </div>
  );
}

/* ===================== MATCH PAGE ===================== */
function MatchPage() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");

  const handleMatch = async () => {
    setResult("Analyzing match...");

    try {
      const res = await api.post("/match-resume", { resume, job });
      const data = res.data;

      setResult(
        `Match Score: ${data.score}\n\nMissing Skills:\n${(data.missing_skills || []).join("\n")}`
      );
    } catch (err) {
      console.error(err);
      setResult("Error analyzing match.");
    }
  };

  return (
    <div className="home">
      <h2>Resume ↔ Job Match</h2>

      <TextAreaBlock label="Your Resume" value={resume} onChange={setResume} />
      <TextAreaBlock label="Job Posting" value={job} onChange={setJob} />

      <button onClick={handleMatch}>Analyze Match</button>

      <OutputBox title="Match Analysis" content={result} />
    </div>
  );
}

/* ===================== APP ROOT ===================== */
function App() {
  const [page, setPage] = useState("builder");

  return (
    <div className="app-container">
      <div className="paper-bg" />

      <div className="app-content">
        <div className="title-wrapper">
          <h1>Job Sniper</h1>
        </div>

        <div className="nav-buttons">
          <button onClick={() => setPage("builder")}>Builder</button>
          <button onClick={() => setPage("tailor")}>Tailor</button>
          <button onClick={() => setPage("match")}>Match</button>
        </div>

        <div className="page-wrapper">
          {page === "builder" && <BuilderPage />}
          {page === "tailor" && <TailorPage />}
          {page === "match" && <MatchPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
