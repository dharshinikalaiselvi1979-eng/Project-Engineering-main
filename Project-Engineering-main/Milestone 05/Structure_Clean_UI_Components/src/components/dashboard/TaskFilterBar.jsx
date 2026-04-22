export default function TaskFilterBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        {["all", "active", "completed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />
    </div>
  );
}