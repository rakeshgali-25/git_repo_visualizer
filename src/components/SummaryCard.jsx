export default function SummaryCard({ variant = "blue", label, value }) {
  return (
    <div className={`card ${variant}`}>
      <div className="card-label">{label}</div>
      <div className="card-value">{value ?? 0}</div>
    </div>
  );
}
