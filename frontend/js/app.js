/**
 * ===== LOGIQUE DE L'INTERFACE (app.js) =====
 *
 * Ce fichier gère uniquement l'affichage et les interactions utilisateur.
 * Il ne sait pas où sont stockées les données : il passe toujours par
 * "TaskService" (défini dans storage.js).
 */

// ----- 1. Récupération des éléments HTML -----
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const counter = document.getElementById("task-counter");
const clearDoneBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

// ----- 2. État de l'application -----
let tasks = [];             // copie locale des tâches
let currentFilter = "all";  // "all" | "active" | "done"

// ----- 3. Affichage -----

// Renvoie les tâches correspondant au filtre sélectionné
function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.done);
  if (currentFilter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

// Crée l'élément <li> d'une tâche
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.done ? " done" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  // textContent (et pas innerHTML) : protège contre l'injection de code HTML (XSS)
  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Supprimer";
  deleteBtn.textContent = "✕";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));

  li.append(checkbox, title, deleteBtn);
  return li;
}

// Redessine toute la liste à partir de l'état "tasks"
function render() {
  const visibleTasks = getFilteredTasks();

  list.innerHTML = "";
  visibleTasks.forEach((task) => list.appendChild(createTaskElement(task)));

  emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";

  const remaining = tasks.filter((t) => !t.done).length;
  counter.textContent = `${remaining} tâche${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`;
}

// ----- 4. Actions -----

async function addTask(title) {
  const newTask = await TaskService.create(title);
  tasks.push(newTask);
  render();
}

async function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  const updated = await TaskService.update(id, { done: !task.done });
  Object.assign(task, updated);
  render();
}

async function deleteTask(id) {
  await TaskService.remove(id);
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

async function clearDoneTasks() {
  const doneTasks = tasks.filter((t) => t.done);
  for (const task of doneTasks) {
    await TaskService.remove(task.id);
  }
  tasks = tasks.filter((t) => !t.done);
  render();
}

// ----- 5. Écouteurs d'événements -----

form.addEventListener("submit", (event) => {
  event.preventDefault(); // empêche le rechargement de la page
  const title = input.value.trim();
  if (title === "") return;
  addTask(title);
  input.value = "";
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

clearDoneBtn.addEventListener("click", clearDoneTasks);

// ----- 6. Démarrage -----
async function init() {
  tasks = await TaskService.getAll();
  render();
}

init();
