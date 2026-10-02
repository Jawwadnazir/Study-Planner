/* =========================================================
   Study Planner — App Logic
   ========================================================= */

// ---- DOM References ----
const totalTasks     = document.querySelector(".total-tasks");
const completedTasks = document.querySelector(".completed-tasks");
const activeTasks    = document.querySelector(".active-tasks");

const taskContainer = document.querySelector(".tasks-container");
const category      = document.querySelector("#controls");
const form          = document.querySelector("#task-form");

const formTitle    = document.querySelector(".title");
const formSubject  = document.querySelector(".subject");
const formPriority = document.querySelector(".priority");
const formDate     = document.querySelector("#due-date");

// ---- State ----
let expenses = getDataFromLocal();
let currentFilter = "all"; // all | active | completed

/* =========================================================
   Local Storage
   ========================================================= */
function getDataFromLocal() {
  try {
    const data = localStorage.getItem("expenses");
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (err) {
    showMessage(err);
    return [];
  }
}

function saveDataInLocal() {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  } catch (err) {
    showMessage("Problem Occurs While Saving Data In Local Storage");
  }
}

/* =========================================================
   Helpers
   ========================================================= */
function showMessage(message) {
  console.log(message);
}

function getLocalDate() {
  const d = new Date();
  const date  = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year  = String(d.getFullYear());
  return `${year}-${month}-${date}`;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(10).slice(2)}`;
}

/* Escape user input before injecting into HTML */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* =========================================================
   Create Task HTML
   ========================================================= */
function createTaskJsx(item) {
  const completedClass = item.state ? "completed" : "active";
  const checkedAttr    = item.state ? "checked" : "";
  const safeTitle      = escapeHtml(item.title);
  const safeSubject    = escapeHtml(item.subject);
  const safePriority   = escapeHtml(item.priority);
  const safeDate       = escapeHtml(item.date || "");

  return `
    <div class="task ${completedClass}" id="${item.id}">
      <input
        type="checkbox"
        name="task-input"
        class="task-checkbox"
        ${checkedAttr}
      />
      <div class="task-content">
        <h2 class="task-title">${safeTitle}</h2>
        <div class="task-metadata">
          <span>${safeSubject}</span>
          <span class="priority ${safePriority.toLowerCase()}">${safePriority}</span>
          <span>${safeDate}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="delete-btn" type="button" data-action="delete">Delete</button>
      </div>
    </div>`;
}

/* =========================================================
   Rendering
   ========================================================= */
function getFilteredTasks() {
  if (currentFilter === "active") {
    return expenses.filter((t) => !t.state);
  }
  if (currentFilter === "completed") {
    return expenses.filter((t) => t.state);
  }
  return expenses;
}

function renderTasks() {
  const tasksToRender = getFilteredTasks();

  if (tasksToRender.length === 0) {
    const message =
      expenses.length === 0
        ? "Click Add To Create Task"
        : `No ${currentFilter} tasks`;
    taskContainer.innerHTML = `<div class="no-task-to-render">${message}</div>`;
    return;
  }

  taskContainer.innerHTML = tasksToRender.map(createTaskJsx).join("");
}

function renderTotalTasks() {
  totalTasks.innerText = expenses.length;
}

function renderActiveTasks() {
  activeTasks.innerText = expenses.filter((t) => !t.state).length;
}

function renderCompletedTasks() {
  completedTasks.innerText = expenses.filter((t) => t.state).length;
}

function renderTasksSummary() {
  renderTotalTasks();
  renderActiveTasks();
  renderCompletedTasks();
}

function render() {
  renderTasks();
  renderTasksSummary();
}

/* =========================================================
   Form Submit
   ========================================================= */
function handleFormSubmit(event) {
  event.preventDefault();

  const title    = formTitle.value.trim().toUpperCase();
  const subject  = formSubject.value.trim().toUpperCase();
  const priority = formPriority.value.trim().toUpperCase();
  const date     = formDate.value;

  if (!title || !subject || !priority) {
    showMessage("Enter A Valid Input");
    return;
  }

  const expense = {
    id: generateId(),
    title,
    subject,
    priority,
    date,
    state: false,
  };

  expenses.push(expense);
  saveDataInLocal();
  form.reset();
  formDate.value = getLocalDate();
  render();
}

/* =========================================================
   Task Container Clicks (checkbox + delete)
   ========================================================= */
function handleTaskClick(event) {
  const taskEl = event.target.closest(".task");
  if (!taskEl) return;

  const taskId = taskEl.id;
  const task   = expenses.find((t) => t.id === taskId);
  if (!task) return;

  // ---- Checkbox toggle ----
  if (event.target.classList.contains("task-checkbox")) {
    task.state = event.target.checked;
    saveDataInLocal();
    render();
    return;
  }

  // ---- Delete button ----
  if (event.target.dataset.action === "delete") {
    expenses = expenses.filter((t) => t.id !== taskId);
    saveDataInLocal();
    render();
  }
}

/* =========================================================
   Filter Change
   ========================================================= */
function handleFilterChange(event) {
  currentFilter = event.target.value;
  render();
}

/* =========================================================
   Event Handlers
   ========================================================= */
form.addEventListener("submit", handleFormSubmit);
taskContainer.addEventListener("click", handleTaskClick);
category.addEventListener("change", handleFilterChange);

/* =========================================================
   Init
   ========================================================= */
formDate.value = getLocalDate();
render();