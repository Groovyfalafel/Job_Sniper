
import './App.css'
import { useState } from "react";

function App() {
  const [page, setPage] = useState("builder");

  return (
    <div style={{ padding: 20 }}>
      <h1>Job Hunt Assistant</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("builder")}>Builder</button>
        <button onClick={() => setPage("tailor")}>Tailor</button>
        <button onClick={() => setPage("match")}>Match</button>
      </div>

      {page === "builder" && <div>Builder Page</div>}
      {page === "tailor" && <div>Tailor Page</div>}
      {page === "match" && <div>Match Page</div>}
    </div>
  );
}

export default App;
