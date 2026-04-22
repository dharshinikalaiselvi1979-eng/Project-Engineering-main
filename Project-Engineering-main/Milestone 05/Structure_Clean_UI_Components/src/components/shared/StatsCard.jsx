export default function StatCard({ label, value }) {
  return (
    <div style={{ background: "#1a1a2e", border: "1px solid #2d2d44", borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}