import StatCard from "../shared/StatCard";

export default function StatsRow({ stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Completed" value={stats.completed} />
      <StatCard label="Remaining" value={stats.remaining} />
      <StatCard label="Progress" value={`${stats.progress}%`} />
    </div>
  );
}