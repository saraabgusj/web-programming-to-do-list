const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const message = document.querySelector('#message');
const summary = document.querySelector('#summary');
const emptyState = document.querySelector('#empty-state');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch (err) {
    console.warn('Bad saved data, starting fresh', err);
    return [];
  }
}

let tasks = load();

function addTask(title) {
  tasks = [...tasks, { id: Date.now(), title: title, done: false }];
  save();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  renderTasks();
}

function taskToListItem(task) {
  const li = document.createElement('li');
  li.classList.add('task');
  if (task.done) {
    li.classList.add('done');
  }
  li.dataset.id = task.id;

  const title = document.createElement('span');
  title.classList.add('task-title');
  title.textContent = task.title;

  const del = document.createElement('button');
  del.classList.add('delete');
  del.textContent = 'Delete';

  li.append(title, del);
  return li;
}

function renderTasks() {
  list.innerHTML = '';
  tasks
    .map(taskToListItem)
    .forEach(li => list.append(li));

  const doneCount = tasks.reduce((count, t) => t.done ? count + 1 : count, 0);

  if (tasks.length === 0) {
    summary.textContent = '';
    emptyState.textContent = 'No tasks yet. Add your first one above.';
  } else {
    summary.textContent = `${doneCount} of ${tasks.length} done`;
    emptyState.textContent = '';
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const title = input.value.trim();

  if (!title) {
    message.textContent = 'Please type a task before adding it.';
    return;
  }

  message.textContent = '';
  addTask(title);
  input.value = '';
}

function handleListClick(e) {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest('.delete')) {
    deleteTask(id);
    return;
  }
  toggleTask(id);
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);

renderTasks();
