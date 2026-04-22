export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
      <span
        onClick={() => onToggle(task.id)}
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          cursor: "pointer",
        }}
      >
        {task.title}
      </span>

      <button onClick={() => onDelete(task.id)}>✕</button>
    </div>
  );
}