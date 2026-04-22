const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ================= CACHE FIX ================= */
const cache = new Map();

function getCache(key) {
  const data = cache.get(key);
  if (!data) return null;

  if (Date.now() > data.expiry) {
    cache.delete(key);
    return null;
  }

  return data.value;
}

function setCache(key, value, ttl = 60) {
  if (!value) return; // prevent null caching

  const expiry = Date.now() + ttl * 1000;
  cache.set(key, { value, expiry });
}

function deleteCache(key) {
  cache.delete(key);
}

function clearCacheByPrefix(prefix) {
  for (let key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
/* ============================================ */


/* ================= GET ALL TASKS ================= */
app.get('/tasks', async (req, res) => {
  try {
    const cacheKey = 'tasks:list';

    const cached = getCache(cacheKey);
    if (cached) {
      console.log('Serving from cache');
      return res.status(200).json(cached);
    }

    const tasks = await prisma.task.findMany();

    setCache(cacheKey, tasks, 60);

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/* ================= GET TASK BY ID ================= */
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `task:${id}`;

  try {
    const cached = getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    setCache(cacheKey, task, 60);

    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching task', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/* ================= CREATE TASK ================= */
app.post('/tasks', async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: { title, description, price: parseFloat(price) }
    });

    // 🔥 FIX: invalidate list cache
    clearCacheByPrefix('tasks');

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/* ================= DELETE TASK ================= */
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    // 🔥 FIX: invalidate both list + single
    deleteCache(`task:${id}`);
    clearCacheByPrefix('tasks');

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting task', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/* ================= START SERVER ================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Fixed Server running on http://localhost:${PORT}`);
});
// project