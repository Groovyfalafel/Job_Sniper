export default function OutputBox({ title, content, loading = false, mono = false }) {
  // show the box even while loading
  if (!content && !loading) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="output-box">
      <div className="output-header">
        <div className="output-title">{title}</div>

        <div className="output-actions">
          <button
            className="output-action-btn"
            onClick={handleCopy}
            disabled={!content || loading}
            type="button"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="output-body">
        {loading ? (
          <div>
            <div className="skeleton skeleton-line long" />
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-line long" />
            <div className="skeleton skeleton-line short" />
          </div>
        ) : (
          <pre className={`output-content ${mono ? "mono" : ""}`}>{content}</pre>
        )}
      </div>
    </div>
  );
}
