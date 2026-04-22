
export default function AddTaskInput({ newTask, setNewTask, onAdd }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add task"
      />
      <button onClick={onAdd}>Add</button>
    </div>
  );
}