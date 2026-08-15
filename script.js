const STORAGE_KEY = "shopping-list-items";

const appEl = document.querySelector(".app");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("item-input");
const listEl = document.getElementById("item-list");
const summaryEl = document.getElementById("summary-text");
const clearCheckedBtn = document.getElementById("clear-checked");

let items = loadItems();

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  listEl.innerHTML = "";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item" + (item.checked ? " checked" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", () => toggleItem(item.id));

    const span = document.createElement("span");
    span.textContent = item.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "삭제");
    deleteBtn.addEventListener("click", () => deleteItem(item.id));

    li.append(checkbox, span, deleteBtn);
    listEl.appendChild(li);
  }

  appEl.classList.toggle("is-empty", items.length === 0);

  const checkedCount = items.filter((i) => i.checked).length;
  summaryEl.textContent = `${items.length}개 항목 · ${checkedCount}개 완료`;
}

function addItem(text) {
  items.push({ id: crypto.randomUUID(), text, checked: false });
  saveItems();
  render();
}

function toggleItem(id) {
  const item = items.find((i) => i.id === id);
  if (item) item.checked = !item.checked;
  saveItems();
  render();
}

function deleteItem(id) {
  items = items.filter((i) => i.id !== id);
  saveItems();
  render();
}

function clearChecked() {
  items = items.filter((i) => !i.checked);
  saveItems();
  render();
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  addItem(text);
  inputEl.value = "";
  inputEl.focus();
});

clearCheckedBtn.addEventListener("click", clearChecked);

render();
