import { useState } from "react";
import tasks from "../data/tasks";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsRow from "../components/dashboard/StatsRow";
import AddTaskInput from "../components/dashboard/AddTaskInput";
import TaskFilterBar from "../components/dashboard/TaskFilterBar";
import TaskList from "../components/dashboard/TaskList";

export default function DashboardPage() {
  const [taskList, setTaskList] = useState(tasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ADD TASK
  const addTask = () => {
    if (!newTask.trim()) return;

    setTaskList([
      ...taskList,
      {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        tag: "general",
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewTask("");
  };

  // TOGGLE TASK
  const toggleTask = (id) => {
    setTaskList(
      taskList.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // DELETE TASK
  const deleteTask = (id) => {
    setTaskList(taskList.filter((t) => t.id !== id));
  };

  // FILTER + SEARCH
  const filteredTasks = taskList
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // STATS
  const completedCount = taskList.filter((t) => t.completed).length;
  const totalCount = taskList.length;
  const progressPercent =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

  const stats = {
    total: totalCount,
    completed: completedCount,
    remaining: totalCount - completedCount,
    progress: progressPercent,
  };

  // UI ONLY COMPOSITION
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        color: "#e2e8f0",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <DashboardHeader />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* STATS */}
        <StatsRow stats={stats} />

        {/* ADD TASK */}
        <AddTaskInput
          newTask={newTask}
          setNewTask={setNewTask}
          onAdd={addTask}
        />

        {/* FILTER + SEARCH */}
        <TaskFilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* TASK LIST */}
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}