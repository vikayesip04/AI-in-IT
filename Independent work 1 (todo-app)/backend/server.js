const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "tasks.json";

// читання файлу
function readTasks() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// запис файлу
function writeTasks(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

// отримати всі
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// додати
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    done: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

// toggle
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);

  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;

  writeTasks(tasks);
  res.json(tasks);
});

// delete
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const id = parseInt(req.params.id);

  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);

  res.json(tasks);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
