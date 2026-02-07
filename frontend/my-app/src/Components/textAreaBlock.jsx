export default function TextAreaBlock({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontWeight: "bold" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 8 }}
      />
    </div>
  );
}
