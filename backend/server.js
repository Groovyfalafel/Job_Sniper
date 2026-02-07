import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoute from "./routes/match.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/match-resume", matchRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
