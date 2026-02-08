import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoute from "./routes/match.js";
import tailorRoute from "./routes/tailor.js";

console.log("RUNNING FROM CWD:", process.cwd());
console.log("SERVER FILE:", new URL(import.meta.url).pathname);

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => res.json({ ok: true }));

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use("/match-resume", matchRoute);
app.use("/tailor-resume", tailorRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
