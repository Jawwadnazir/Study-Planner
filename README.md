# Study Planner

A simple task manager to plan and track study tasks. Built with plain HTML, CSS, and JavaScript.

## Features

- Add tasks with title, subject, priority, and due date
- Mark tasks as completed
- Filter tasks: All / Active / Completed
- Delete tasks
- Live counters for Total, Active, and Completed tasks
- Data saved in `localStorage`

## Files

- `index.html` — page structure
- `style.css` — styling
- `app.js` — all the logic

## How to Run

Just open `index.html` in your browser. That's it.

> Note: Make sure the checkbox tick icon exists at `./assest/icons8-check-96.png`.

## How It Works

- Tasks are stored in an array called `expenses` (yes, the name is a bit off — I'll rename it later 🙂).
- Every change (add, complete, delete) is saved to `localStorage`.
- `render()` rebuilds the task list and updates the summary counters.

## Known Issues / TODO

- No edit feature yet
- No sort by due date
- No "Clear completed" button
- Delete happens without confirmation
- Variable is named `expenses` but it stores tasks — should be `tasks`
- Icon path uses `assest` (typo) — should be `assets`

## Built With

- HTML
- CSS
- JavaScript (Vanilla)
