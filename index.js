const LS_KEY = "todo_notes_pro_v2";
const THEME_KEY = "todo_theme_v2";
const LANG_KEY = "todo_lang_v1";

// Inputs
const form = document.getElementById("taskForm");
const nameInput = document.getElementById("nameInput");
const imageInput = document.getElementById("imageInput");
const dateInput = document.getElementById("dateInput");
const notesInput = document.getElementById("notesInput");
const noteColorSelect = document.getElementById("noteColor");
const tagsInput = document.getElementById("tagsInput");
const prioritySelect = document.getElementById("prioritySelect");

// Controls
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const confirmClearAll = document.getElementById("confirmClearAll");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const langSelect = document.getElementById("langSelect");

// Summary
const navTotal = document.getElementById("navTotal");
const sumTotal = document.getElementById("sumTotal");
const sumActive = document.getElementById("sumActive");
const sumDone = document.getElementById("sumDone");
const sumText = document.getElementById("sumText");
const sumBar = document.getElementById("sumBar");

// Board
const cardsEl = document.getElementById("cards");

// Toast
const toastEl = document.getElementById("appToast");
const toastText = document.getElementById("toastText");
const toast = new bootstrap.Toast(toastEl, { delay: 1600 });

// State
let items = load();
let query = "";
let filter = "all";
let sort = "newest";
let countdownTimer = null;

// i18n
const i18n = {
  ar: {
    appTitle: "أنجز",
    export: "تصدير",
    import: "استيراد",
    dashboardTitle: "لوحة المهام",
    dashboardSub: "أضف مهام + نوتس بألوان + تتبع الإنجاز",
    total: "Total",
    active: "Active",
    done: "Done",
    progress: "🎯 نسبة الإنجاز",
    addTask: "➕ إضافة مهمة",
    add: "إضافة",
    tip: "💡 Tip: تقدر تضيف Notes إضافية من داخل الكارت.",
    taskNamePh: "اسم المهمة",
    firstNotePh: "اكتب أول نوت...",
    tagsPh: "وسوم: work, study, gym",
    searchPh: "🔎 ابحث داخل الاسم أو النوتس...",
    fAll: "الكل",
    fActive: "نشطة",
    fDone: "منتهية",
    sNewest: "ترتيب: الأحدث",
    sOldest: "ترتيب: الأقدم",
    sDue: "ترتيب: حسب الموعد",
    sPriority: "ترتيب: حسب الأولوية",
    clearDone: "حذف المنتهية",
    clearAll: "حذف الكل",
    confirmTitle: "تأكيد الحذف",
    confirmBody: "هل أنت متأكد أنك تريد حذف كل المهام؟",
    cancel: "إلغاء",
    yesDelete: "نعم، احذف",
    pHigh: "High",
    pMedium: "Medium",
    pLow: "Low",
    tAdded: "✅ تمت إضافة المهمة",
    tUpdated: "✅ تم التحديث",
    tDeleted: "🗑️ تم الحذف",
    noteAdded: "📝 تمت إضافة نوت",
    noteDeleted: "❌ تم حذف النوت",
    clearedDone: "🧹 تم حذف المنتهية",
    noDone: "لا يوجد Completed للحذف",
    allDeleted: "🗑️ تم حذف كل المهام",
    exported: "📦 تم التصدير",
    imported: "✅ تم الاستيراد",
    importFailed: "❌ فشل الاستيراد",
    writeNoteFirst: "✍️ اكتب النوت أولاً",
    overdue: "متأخر",
    today: "اليوم",
    due: "موعد",
    noDate: "بدون موعد",
    addNote: "+ إضافة نوت",
    save: "حفظ",
    markDone: "Mark Done",
    markTodo: "Mark Todo",
    delete: "حذف",
    tags: "Tags",
    priority: "Priority",
    countdown: "الوقت المتبقي"
  },
  en: {
    appTitle: "Anjez",
    export: "Export",
    import: "Import",
    dashboardTitle: "Dashboard",
    dashboardSub: "Tasks + colorful notes + progress tracking",
    total: "Total",
    active: "Active",
    done: "Done",
    progress: "🎯 Progress",
    addTask: "➕ Add Task",
    add: "Add",
    tip: "💡 Tip: You can add more notes inside each card.",
    taskNamePh: "Task name",
    firstNotePh: "Write first note...",
    tagsPh: "tags: work, study, gym",
    searchPh: "🔎 Search in name or notes...",
    fAll: "All",
    fActive: "Active",
    fDone: "Done",
    sNewest: "Sort: Newest",
    sOldest: "Sort: Oldest",
    sDue: "Sort: Due date",
    sPriority: "Sort: Priority",
    clearDone: "Clear Completed",
    clearAll: "Clear All",
    confirmTitle: "Confirm delete",
    confirmBody: "Are you sure you want to delete all tasks?",
    cancel: "Cancel",
    yesDelete: "Yes, delete",
    pHigh: "High",
    pMedium: "Medium",
    pLow: "Low",
    tAdded: "✅ Task added",
    tUpdated: "✅ Updated",
    tDeleted: "🗑️ Deleted",
    noteAdded: "📝 Note added",
    noteDeleted: "❌ Note deleted",
    clearedDone: "🧹 Cleared completed",
    noDone: "No completed tasks",
    allDeleted: "🗑️ All deleted",
    exported: "📦 Exported",
    imported: "✅ Imported",
    importFailed: "❌ Import failed",
    writeNoteFirst: "✍️ Write note first",
    overdue: "Overdue",
    today: "Today",
    due: "Due",
    noDate: "No date",
    addNote: "+ Add Note",
    save: "Save",
    markDone: "Mark Done",
    markTodo: "Mark Todo",
    delete: "Delete",
    tags: "Tags",
    priority: "Priority",
    countdown: "Time left"
  }
};

let lang = loadLang();
applyLang(lang);

// ---------- Theme ----------
applyTheme(loadTheme());

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-bs-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  saveTheme(next);
});

langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  applyLang(lang);
  saveLang(lang);
  render();
});

// Filters
document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

// Search / Sort
searchInput.addEventListener("input", () => { query = searchInput.value.trim().toLowerCase(); render(); });
sortSelect.addEventListener("change", () => { sort = sortSelect.value; render(); });

// Add task
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const due = dateInput.value || "";
  const firstNote = notesInput.value.trim();
  const color = noteColorSelect.value;
  const priority = prioritySelect.value;
  const tags = parseTags(tagsInput.value);

  if (!name || !firstNote) return;

  const file = imageInput.files?.[0];
  const imageBase64 = file ? await fileToBase64(file) : "";

  const task = {
    id: crypto.randomUUID(),
    name,
    due,
    priority,
    tags,
    imageBase64,
    state: "todo",
    createdAt: Date.now(),
    notes: [{ id: crypto.randomUUID(), text: firstNote, color, createdAt: Date.now() }]
  };

  items.unshift(task);
  save();
  form.reset();
  showToast(t("tAdded"));
  render();
});

// Clear buttons
clearDoneBtn.addEventListener("click", () => {
  const before = items.length;
  items = items.filter(t => t.state !== "done");
  if (items.length !== before) { save(); showToast(t("clearedDone")); render(); }
  else showToast(t("noDone"));
});

confirmClearAll.addEventListener("click", () => {
  items = [];
  save();
  showToast(t("allDeleted"));
  render();
});


// Event delegation
cardsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const card = btn.closest("[data-id]");
  if (!card) return;

  const taskId = card.dataset.id;

  if (action === "toggle") toggleTask(taskId);
  if (action === "delete") deleteTask(taskId);
  if (action === "showAddNote") toggleAddNoteBox(card);
  if (action === "addNote") addNoteFromCard(card, taskId);
  if (action === "deleteNote") deleteNote(taskId, btn.dataset.noteId);
});

// Live countdown update every second
startCountdownTicker();

// Initial render
render();

// ---------------- Render ----------------
function render() {
  const list = applyQueryFilterSort(items, query, filter, sort);
  updateSummary(items);

  if (list.length === 0) {
    cardsEl.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary border-0 rounded-4 shadow-sm mb-0">
          ${query ? (lang === "ar" ? "لا توجد نتائج للبحث." : "No results.") : (lang === "ar" ? "لا توجد مهام بعد." : "No tasks yet.")}
        </div>
      </div>
    `;
    return;
  }

  cardsEl.innerHTML = list.map(taskCard).join("");
  // after render, update countdown text instantly
  updateAllCountdowns();
}

function taskCard(tk) {
  const done = tk.state === "done";
  const imgSrc = tk.imageBase64 || "https://via.placeholder.com/160?text=image";
  const dueBadge = renderDueBadge(tk.due, done);

  const priorityBadge = renderPriorityBadge(tk.priority);
  const tagsHTML = (tk.tags || []).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join(" ");

  const notesHTML = tk.notes.map(n => `
    <div class="note ${n.color} flex-grow-1" style="min-width: 170px;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <small class="opacity-75">${new Date(n.createdAt).toLocaleDateString()}</small>
        <button class="btn btn-sm btn-outline-dark py-0 px-2" data-action="deleteNote" data-note-id="${n.id}" title="Delete note">×</button>
      </div>
      <div>${escapeHtml(n.text)}</div>
    </div>
  `).join("");

  // countdown placeholder (updated by ticker)
  const countdownId = `cd_${tk.id}`;

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card border-0 shadow-sm rounded-4 h-100" data-id="${tk.id}">
        <div class="card-body d-flex flex-column gap-3">

          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="small text-body-secondary">${t("priority")}: ${priorityBadge}</div>
              <div class="fw-bold">${escapeHtml(tk.name)}</div>
            </div>
            <div class="d-flex flex-column align-items-end gap-1">
              <span class="badge ${done ? "text-bg-success" : "text-bg-secondary"}">${done ? "done" : "todo"}</span>
              ${dueBadge}
            </div>
          </div>

          <img src="${imgSrc}" class="rounded-4 border w-100" style="height:180px; object-fit:cover;"
               alt="image" loading="lazy" onerror="this.src='https://via.placeholder.com/160?text=image'"/>

          <div class="d-flex justify-content-between align-items-center">
            <span class="small text-body-secondary">${t("countdown")}</span>
            <span class="small fw-semibold" id="${countdownId}" data-countdown-for="${tk.id}">—</span>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <span class="small text-body-secondary">${t("tags")}</span>
            <div class="d-flex flex-wrap gap-1 text-end">${tagsHTML || `<span class="text-body-secondary small">—</span>`}</div>
          </div>

          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="fw-semibold text-body-secondary">Notes</div>
              <button class="btn btn-outline-primary btn-sm" data-action="showAddNote">${t("addNote")}</button>
            </div>
            <div class="d-flex flex-wrap gap-2">
              ${notesHTML}
            </div>

            <div class="mt-3 d-none add-note-box">
              <textarea class="form-control mb-2 add-note-text" rows="3" placeholder="${lang === "ar" ? "اكتب نوت جديدة..." : "Write a new note..."}"></textarea>
              <div class="d-flex gap-2">
                <select class="form-select add-note-color" style="max-width: 190px;">
                  <option value="note-yellow">Yellow</option>
                  <option value="note-blue">Blue</option>
                  <option value="note-pink">Pink</option>
                  <option value="note-green">Green</option>
                  <option value="note-purple">Purple</option>
                </select>
                <button class="btn btn-primary" data-action="addNote">${t("save")}</button>
              </div>
            </div>
          </div>

          <div class="mt-auto d-flex gap-2 justify-content-between pt-2 border-top">
            <button class="btn btn-outline-dark btn-sm" data-action="toggle">
              ${done ? t("markTodo") : t("markDone")}
            </button>
            <button class="btn btn-outline-danger btn-sm" data-action="delete">${t("delete")}</button>
          </div>

        </div>
      </div>
    </div>
  `;
}

// ---------------- Priority / Tags / Countdown ----------------

function renderPriorityBadge(p) {
  if (p === "high") return `<span class="badge text-bg-danger">${t("pHigh")}</span>`;
  if (p === "medium") return `<span class="badge text-bg-warning text-dark">${t("pMedium")}</span>`;
  return `<span class="badge text-bg-info">${t("pLow")}</span>`;
}

function parseTags(raw) {
  return String(raw || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function renderDueBadge(due, done) {
  if (!due) return `<span class="badge text-bg-light border">${t("noDate")}</span>`;

  const now = new Date();
  const d = new Date(due);

  if (!done && d < now) return `<span class="badge text-bg-danger">${t("overdue")}</span>`;

  const sameDay = now.toDateString() === d.toDateString();
  if (!done && sameDay) return `<span class="badge text-bg-warning text-dark">${t("today")}</span>`;

  return `<span class="badge text-bg-info">${t("due")}</span>`;
}

function getCountdownText(due, state) {
  if (!due) return "—";
  if (state === "done") return "✅";

  const now = Date.now();
  const target = Date.parse(due);
  if (Number.isNaN(target)) return "—";

  let diff = target - now;

  const overdue = diff < 0;
  diff = Math.abs(diff);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const text = days > 0
    ? `${days}d ${hours}h`
    : `${hours}h ${mins}m ${secs}s`;

  return overdue ? `⛔ ${text}` : `⏳ ${text}`;
}

function updateAllCountdowns() {
  document.querySelectorAll("[data-countdown-for]").forEach(el => {
    const taskId = el.getAttribute("data-countdown-for");
    const task = items.find(tk => tk.id === taskId);
    if (!task) return;
    el.textContent = getCountdownText(task.due, task.state);
  });
}

function startCountdownTicker() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    // update countdown without re-render
    updateAllCountdowns();
  }, 1000);
}

// ---------------- Actions ----------------

function toggleTask(taskId) {
  items = items.map(tk => tk.id === taskId ? { ...tk, state: tk.state === "done" ? "todo" : "done" } : tk);
  save();
  showToast(t("tUpdated"));
  render();
}

function deleteTask(taskId) {
  items = items.filter(tk => tk.id !== taskId);
  save();
  showToast(t("tDeleted"));
  render();
}

function toggleAddNoteBox(cardEl) {
  const box = cardEl.querySelector(".add-note-box");
  box.classList.toggle("d-none");
}

function addNoteFromCard(cardEl, taskId) {
  const textEl = cardEl.querySelector(".add-note-text");
  const colorEl = cardEl.querySelector(".add-note-color");

  const text = textEl.value.trim();
  const color = colorEl.value;

  if (!text) return showToast(t("writeNoteFirst"));

  items = items.map(tk => {
    if (tk.id !== taskId) return tk;
    return {
      ...tk,
      notes: [...tk.notes, { id: crypto.randomUUID(), text, color, createdAt: Date.now() }]
    };
  });

  save();
  showToast(t("noteAdded"));
  render();
}

function deleteNote(taskId, noteId) {
  items = items.map(tk => {
    if (tk.id !== taskId) return tk;
    return { ...tk, notes: tk.notes.filter(n => n.id !== noteId) };
  });

  save();
  showToast(t("noteDeleted"));
  render();
}

// ---------------- Summary ----------------

function updateSummary(all) {
  const total = all.length;
  const done = all.filter(tk => tk.state === "done").length;
  const active = total - done;
  const percent = total ? Math.round((done / total) * 100) : 0;

  navTotal.textContent = total;
  sumTotal.textContent = total;
  sumActive.textContent = active;
  sumDone.textContent = done;
  sumText.textContent = `${done} / ${total}`;

  sumBar.style.width = `${percent}%`;
  sumBar.className = "progress-bar";
  if (percent < 40) sumBar.classList.add("bg-danger");
  else if (percent < 75) sumBar.classList.add("bg-warning");
  else sumBar.classList.add("bg-success");
}

// ---------------- Query / Filter / Sort ----------------

function applyQueryFilterSort(list, q, f, s) {
  let out = list;

  if (q) {
    out = out.filter(tk => {
      const inName = tk.name.toLowerCase().includes(q);
      const inNotes = tk.notes.some(n => n.text.toLowerCase().includes(q));
      const inTags = (tk.tags || []).some(tag => tag.toLowerCase().includes(q));
      return inName || inNotes || inTags;
    });
  }

  if (f === "active") out = out.filter(tk => tk.state !== "done");
  if (f === "done") out = out.filter(tk => tk.state === "done");

  const priorityRank = { high: 1, medium: 2, low: 3 };

  if (s === "newest") out = [...out].sort((a, b) => b.createdAt - a.createdAt);
  if (s === "oldest") out = [...out].sort((a, b) => a.createdAt - b.createdAt);
  if (s === "due") {
    out = [...out].sort((a, b) => {
      const ad = a.due ? Date.parse(a.due) : Infinity;
      const bd = b.due ? Date.parse(b.due) : Infinity;
      return ad - bd;
    });
  }
  if (s === "priority") {
    out = [...out].sort((a, b) => (priorityRank[a.priority] || 9) - (priorityRank[b.priority] || 9));
  }

  return out;
}

// ---------------- Toast ----------------

function showToast(msg) {
  toastText.textContent = msg;
  toast.show();
}

// ---------------- Storage ----------------

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTheme(theme) { localStorage.setItem(THEME_KEY, theme); }
function loadTheme() { return localStorage.getItem(THEME_KEY) || "light"; }
function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

function saveLang(l) { localStorage.setItem(LANG_KEY, l); }
function loadLang() { return localStorage.getItem(LANG_KEY) || "ar"; }

function applyLang(l) {
  // set UI direction
  const html = document.documentElement;
  if (l === "ar") { html.setAttribute("lang","ar"); html.setAttribute("dir","rtl"); }
  else { html.setAttribute("lang","en"); html.setAttribute("dir","ltr"); }

  langSelect.value = l;

  // text replacements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const k = el.getAttribute("data-i18n-ph");
    el.setAttribute("placeholder", t(k));
  });
}

function t(key) {
  return (i18n[lang] && i18n[lang][key]) ? i18n[lang][key] : key;
}

// ---------------- Helpers ----------------

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
document.getElementById("year").textContent = new Date().getFullYear();