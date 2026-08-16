const SUPABASE_URL = "https://qdqlqgsulpzxeshsqnyj.supabase.co";
const SUPABASE_KEY = "sb_publishable_nUs7UFOsHiHuO4go7lYfsw_wRTeBzKK";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const appEl = document.querySelector(".app");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("item-input");
const listEl = document.getElementById("item-list");
const summaryEl = document.getElementById("summary-text");
const clearCheckedBtn = document.getElementById("clear-checked");

let items = [];

async function loadItems() {
  const { data, error } = await supabaseClient
    .from("shopping_items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("아이템을 불러오지 못했습니다:", error);
    return;
  }

  items = data;
  render();
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

async function addItem(text) {
  const { data, error } = await supabaseClient
    .from("shopping_items")
    .insert({ text })
    .select()
    .single();

  if (error) {
    console.error("아이템을 추가하지 못했습니다:", error);
    return;
  }

  items.push(data);
  render();
}

async function toggleItem(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;

  const { error } = await supabaseClient
    .from("shopping_items")
    .update({ checked: !item.checked })
    .eq("id", id);

  if (error) {
    console.error("아이템을 갱신하지 못했습니다:", error);
    return;
  }

  item.checked = !item.checked;
  render();
}

async function deleteItem(id) {
  const { error } = await supabaseClient
    .from("shopping_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("아이템을 삭제하지 못했습니다:", error);
    return;
  }

  items = items.filter((i) => i.id !== id);
  render();
}

async function clearChecked() {
  const checkedIds = items.filter((i) => i.checked).map((i) => i.id);
  if (checkedIds.length === 0) return;

  const { error } = await supabaseClient
    .from("shopping_items")
    .delete()
    .in("id", checkedIds);

  if (error) {
    console.error("완료된 항목을 삭제하지 못했습니다:", error);
    return;
  }

  items = items.filter((i) => !i.checked);
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

loadItems();
