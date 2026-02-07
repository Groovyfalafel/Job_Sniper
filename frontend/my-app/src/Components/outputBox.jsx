export default function OutputBox({ title, content }) {
  if (!content) return null;

  return (
    <div style={{ marginTop: 20, border: "1px solid #ccc", padding: 12 }}>
      <h3>{title}</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
    </div>
  );
}
