/* ========== Роли ========== */
const roles = {
  all:        "Все",
  frontend:   "Frontend",
  backend:    "Backend",
  fullstack:  "Fullstack",
  analyst:    "Аналитик",
  data:       "Data Scientist",
  office:     "Офис",
  devops:     "DevOps",
  qa:         "QA",
  pm:         "Project Manager",
  designer:   "UI/UX дизайнер",
};

const ALL_ROLES = Object.keys(roles).filter(k => k !== "all");

/* ========== Данные ==========
   Лист:   { name, rating: 0..10, roles: [...] }
   Ветка:  { name, children: [...], category?: "hard"|"soft", short?: "..." }
   rating и min у веток считаются автоматически. */
const skillsData = [
  /* ---------- HARD ---------- */
  {
    name: "Веб-разработка",
    short: "Веб",
    category: "hard",
    children: [
      { name: "HTML", rating: 9, roles: ["frontend", "fullstack", "designer"] },
      { name: "CSS",  rating: 7, roles: ["frontend", "fullstack", "designer"] },
      {
        name: "JavaScript",
        children: [
          { name: "Основы",    rating: 6, roles: ["frontend", "fullstack"] },
          { name: "DOM",       rating: 5, roles: ["frontend"] },
          { name: "Fetch/API", rating: 4, roles: ["frontend", "backend", "fullstack"] },
        ],
      },
    ],
  },
  {
    name: "Программирование",
    short: "Код",
    category: "hard",
    children: [
      {
        name: "Python",
        children: [
          {
            name: "Язык",
            children: [
              { name: "Типы и операции", rating: 8.5, roles: ["backend", "analyst", "data", "devops"] },
              { name: "Синтаксис",       rating: 8.0, roles: ["backend", "analyst", "data", "devops"] },
              { name: "Функции",         rating: 7.0, roles: ["backend", "analyst", "data"] },
              { name: "ООП",             rating: 6.0, roles: ["backend", "data"] },
              { name: "Асинхронность",   rating: 3.0, roles: ["backend"] },
            ],
          },
          {
            name: "Инструменты",
            children: [
              { name: "venv / poetry", rating: 7.0, roles: ["backend", "devops"] },
              { name: "pytest",        rating: 5.0, roles: ["backend"] },
              { name: "mypy / ruff",   rating: 3.0, roles: ["backend"] },
            ],
          },
          {
            name: "Библиотеки",
            children: [
              { name: "pandas",     rating: 7.0, roles: ["analyst", "data"] },
              { name: "numpy",      rating: 6.0, roles: ["analyst", "data"] },
              { name: "matplotlib", rating: 5.0, roles: ["analyst", "data"] },
            ],
          },
        ],
      },
      { name: "Django", rating: 4, roles: ["backend", "fullstack"] },
      { name: "Git",    rating: 6, roles: ["frontend", "backend", "devops", "fullstack"] },
    ],
  },
  {
    name: "Офисный пакет",
    short: "Офис",
    category: "hard",
    children: [
      { name: "Excel",      rating: 10, roles: ["office", "analyst", "pm"] },
      { name: "Word",       rating: 9,  roles: ["office", "pm"] },
      { name: "PowerPoint", rating: 8,  roles: ["office", "pm"] },
    ],
  },
  {
    name: "Аналитика",
    short: "Data",
    category: "hard",
    children: [
      { name: "SQL",     rating: 6, roles: ["analyst", "backend", "data"] },
      { name: "Pandas",  rating: 4, roles: ["analyst", "data"] },
      { name: "Tableau", rating: 3, roles: ["analyst", "data", "pm"] },
    ],
  },
  {
    name: "Инфраструктура",
    short: "Инфра",
    category: "hard",
    children: [
      { name: "Docker",  rating: 5, roles: ["devops", "backend"] },
      { name: "CI/CD",   rating: 4, roles: ["devops"] },
      { name: "Linux",   rating: 6, roles: ["devops", "backend"] },
    ],
  },

  /* ---------- SOFT ---------- */
  {
    name: "Эмоциональный интеллект",
    short: "EQ",
    category: "soft",
    children: [
      { name: "Самосознание",        rating: 7, roles: ALL_ROLES },
      { name: "Эмпатия",             rating: 8, roles: ALL_ROLES },
      { name: "Управление эмоциями", rating: 6, roles: ALL_ROLES },
    ],
  },
  {
    name: "Лидерство",
    short: "Лидер",
    category: "soft",
    children: [
      { name: "Делегирование",     rating: 5, roles: ["pm", "devops"] },
      { name: "Мотивация команды", rating: 6, roles: ["pm"] },
      { name: "Принятие решений",  rating: 7, roles: ALL_ROLES },
    ],
  },
  {
    name: "Публичная презентация",
    short: "Речь",
    category: "soft",
    children: [
      { name: "Структура выступления", rating: 7, roles: ALL_ROLES },
      { name: "Работа с аудиторией",   rating: 6, roles: ALL_ROLES },
      { name: "Визуализация",          rating: 7, roles: ["designer", "pm"] },
    ],
  },
  {
    name: "Креативность",
    short: "Креатив",
    category: "soft",
    children: [
      { name: "Генерация идей",         rating: 8, roles: ALL_ROLES },
      { name: "Нестандартное мышление", rating: 7, roles: ALL_ROLES },
      { name: "Дизайн-мышление",        rating: 5, roles: ["designer"] },
    ],
  },
  {
    name: "Тайм-менеджмент",
    short: "Время",
    category: "soft",
    children: [
      { name: "Планирование",        rating: 7, roles: ALL_ROLES },
      { name: "Приоритизация",       rating: 6, roles: ALL_ROLES },
      { name: "Управление задачами", rating: 7, roles: ALL_ROLES },
    ],
  },
  {
    name: "Критическое мышление",
    short: "Крит.",
    category: "soft",
    children: [
      { name: "Анализ",            rating: 8, roles: ALL_ROLES },
      { name: "Логика",            rating: 7, roles: ALL_ROLES },
      { name: "Оценка источников", rating: 6, roles: ALL_ROLES },
    ],
  },
  {
    name: "Переговоры",
    short: "Перег.",
    category: "soft",
    children: [
      { name: "Подготовка",         rating: 6, roles: ALL_ROLES },
      { name: "Аргументация",       rating: 7, roles: ALL_ROLES },
      { name: "Поиск компромиссов", rating: 8, roles: ALL_ROLES },
    ],
  },
];

/* ========== Настройки ========== */
const TOP_N = 8;
const WEAK_THRESHOLD = 1.5;  // на сколько min должен быть ниже среднего, чтобы показать бейдж

/* ========== Состояние ========== */
const activeRoles   = new Set();
const expandedNodes = new Set();
let   rolesExpanded = false;
let   searchQuery   = "";

/* ========== Логика ========== */

function ratingToStars(rating10) {
  const raw = rating10 / 2;
  return Math.floor(raw * 2) / 2;
}

function isLeafVisible(node) {
  if (activeRoles.size === 0) return true;
  if (!Array.isArray(node.roles)) return false;
  for (const r of node.roles) {
    if (activeRoles.has(r)) return true;
  }
  return false;
}

/* Возвращает { visible, rating, min, children } — рекурсивно */
function evaluate(node) {
  // Лист
  if (!node.children || !node.children.length) {
    const visible = isLeafVisible(node);
    const value   = visible ? (node.rating ?? 0) : 0;
    return {
      visible,
      rating: value,
      min:    value,     // у листа min === rating
      children: [],
    };
  }

  // Ветка
  const evaluatedChildren = node.children.map(evaluate);
  const visibleChildren   = evaluatedChildren.filter(c => c.visible);

  const visible = visibleChildren.length > 0;
  const rating  = visible
    ? visibleChildren.reduce((s, c) => s + c.rating, 0) / visibleChildren.length
    : 0;
  const min = visible
    ? Math.min(...visibleChildren.map(c => c.min))
    : 0;

  return { visible, rating, min, children: evaluatedChildren };
}

function collectVisibleLeaves() {
  const result = [];
  function walk(node) {
    if (node.children && node.children.length) {
      node.children.forEach(walk);
      return;
    }
    if (isLeafVisible(node)) result.push(node);
  }
  skillsData.forEach(walk);
  return result;
}

function computeRoleScores() {
  const acc = {};
  function walk(node) {
    if (node.children && node.children.length) {
      node.children.forEach(walk);
      return;
    }
    if (Array.isArray(node.roles)) {
      node.roles.forEach(r => {
        if (!acc[r]) acc[r] = { sum: 0, count: 0 };
        acc[r].sum   += node.rating ?? 0;
        acc[r].count += 1;
      });
    }
  }
  skillsData.forEach(walk);

  const scores = {};
  for (const r in acc) scores[r] = acc[r].sum / acc[r].count;
  return scores;
}

/* ========== URL-хэш ========== */

function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  h.split(",").forEach(r => {
    if (r && roles[r]) activeRoles.add(r);
  });
}

function writeHash() {
  if (location.protocol === "file:") return;
  const h       = [...activeRoles].sort().join(",");
  const newHash = h ? "#" + h : "";
  if (newHash === location.hash) return;
  try {
    const url = newHash || (location.pathname + location.search);
    history.replaceState(null, "", url);
  } catch (e) {
    console.warn("replaceState failed:", e);
  }
}

/* ========== Радар-диаграммы ========== */

function drawRadarOn(canvas, items) {
  if (!canvas) return;
  const n = items.length;

  const dpr  = window.devicePixelRatio || 1;
  const size = canvas.clientWidth;

  if (n < 3 || !size) {
    if (canvas.getContext) {
      canvas.width = canvas.height = 0;
    }
    canvas._radar = null;
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const pad = 28;
  const R = size / 2 - pad;

  const angleFor = i => (Math.PI * 2 * i / n) - Math.PI / 2;

  // Сетка
  ctx.strokeStyle = "#e6e8eb";
  ctx.lineWidth = 1;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const r = R * (lvl / 5);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = angleFor(i);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Оси
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  }
  ctx.stroke();

  // Значения
  const values = items.map(it => it.eval.visible ? it.eval.rating / 10 : 0);

  ctx.beginPath();
  values.forEach((v, i) => {
    const a = angleFor(i);
    const r = R * v;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();

  ctx.fillStyle   = "rgba(47, 107, 255, .22)";
  ctx.fill();
  ctx.strokeStyle = "#2f6bff";
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Точки
  values.forEach((v, i) => {
    const a = angleFor(i);
    const r = R * v;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#2f6bff";
    ctx.fill();
  });

  // Подписи осей
  ctx.fillStyle    = "#555";
  ctx.font         = "600 10px system-ui, sans-serif";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  items.forEach((it, i) => {
    const a = angleFor(i);
    const lx = cx + Math.cos(a) * (R + 14);
    const ly = cy + Math.sin(a) * (R + 14);
    const label = it.group.short || it.group.name.slice(0, 8);
    ctx.fillText(label, lx, ly);
  });

  canvas._radar = { cx, cy, R, n, angleFor, items };
}

function renderRadars(evals) {
  const pairs = skillsData.map((g, i) => ({ group: g, eval: evals[i] }));
  const hard  = pairs.filter(p => p.group.category === "hard");
  const soft  = pairs.filter(p => p.group.category === "soft");

  drawRadarOn(document.getElementById("radar-hard"), hard);
  drawRadarOn(document.getElementById("radar-soft"), soft);
}

/* ========== Тултип для радаров ========== */

function findNearestAxis(radar, mx, my) {
  const { cx, cy, n, angleFor, items, R } = radar;

  const dx = mx - cx;
  const dy = my - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > R + 4) return null;

  const angle = Math.atan2(dy, dx);

  let best = 0;
  let bestDiff = Infinity;

  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    let diff = angle - a;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const absDiff = Math.abs(diff);
    if (absDiff < bestDiff) {
      bestDiff = absDiff;
      best = i;
    }
  }

  if (bestDiff > Math.PI / n) return null;

  return { index: best, item: items[best] };
}

function attachRadarTooltips(canvas) {
  if (!canvas || canvas._tooltipsAttached) return;
  canvas._tooltipsAttached = true;

  const tip = () => document.getElementById("radar-tooltip");

  canvas.addEventListener("mousemove", (e) => {
    const el = tip();
    if (!el) return;

    const radar = canvas._radar;
    if (!radar) { el.hidden = true; return; }

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (mx < 0 || my < 0 || mx > rect.width || my > rect.height) {
      el.hidden = true;
      return;
    }

    const found = findNearestAxis(radar, mx, my);
    if (!found) { el.hidden = true; return; }

    const { item } = found;
    const rating10    = item.eval.visible ? item.eval.rating : 0;
    const ratingStars = ratingToStars(rating10);

    el.innerHTML = `
      <span class="radar-tooltip__name">${item.group.name}</span>
      <span class="radar-tooltip__rating">
        <span class="radar-tooltip__num">${rating10.toFixed(1)}</span>
        <span class="radar-tooltip__stars">
          <span class="stars" style="--rating: ${ratingStars}"></span>
        </span>
      </span>
    `;
    el.hidden = false;

    const pad = 14;
    const tw  = el.offsetWidth;
    const th  = el.offsetHeight;
    let left = e.clientX + pad;
    let top  = e.clientY + pad;

    if (left + tw > window.innerWidth - 8)  left = e.clientX - tw - pad;
    if (top  + th > window.innerHeight - 8) top  = e.clientY - th - pad;

    el.style.left = left + "px";
    el.style.top  = top  + "px";
  });

  canvas.addEventListener("mouseleave", () => {
    const el = tip();
    if (el) el.hidden = true;
  });
}

/* ========== Рендер навыков (аккордеон + слабые места) ========== */

function renderSkill(node, evaluated, path = "", level = 0) {
  if (!evaluated.visible) return [];

  const key         = path ? `${path}/${node.name}` : node.name;
  const stars       = ratingToStars(evaluated.rating);
  const hasChildren = evaluated.children.some(c => c.visible);
  const isExpanded  = hasChildren && expandedNodes.has(key);

  // Бейдж «слабое место» — только у веток с просадкой
  const showWeak = hasChildren && evaluated.min < evaluated.rating - WEAK_THRESHOLD;

  const li = document.createElement("li");
  li.className = "skill" +
    (hasChildren ? " skill--has-children" : "") +
    (isExpanded  ? " skill--expanded"     : "");

  let namePart;
  if (hasChildren) {
    namePart = `
      <button type="button"
              class="skill-toggle"
              data-key="${key}"
              aria-expanded="${isExpanded}">
        <span class="skill-caret" aria-hidden="true"></span>
        <span class="skill-name">${node.name}</span>
      </button>
    `;
  } else {
    namePart = `<span class="skill-name">${node.name}</span>`;
  }

  const weakBadge = showWeak
    ? `<span class="skill-weak" title="Слабое место: ${evaluated.min.toFixed(1)} из 10">↓ ${evaluated.min.toFixed(1)}</span>`
    : "";

  li.innerHTML = `
    ${namePart}
    <span class="skill-meta">
      ${weakBadge}
      <span class="stars" style="--rating: ${stars}"
            aria-label="${evaluated.rating.toFixed(1)} из 10"></span>
    </span>
  `;

  const items = [li];

  if (hasChildren && isExpanded) {
    const wrapperLi = document.createElement("li");
    wrapperLi.className = "skill-subgroup";

    const subUl = document.createElement("ul");
    subUl.className = "skills-list skills-list--nested";

    node.children.forEach((child, i) => {
      renderSkill(child, evaluated.children[i], key, level + 1)
        .forEach(el => subUl.appendChild(el));
    });

    wrapperLi.appendChild(subUl);
    items.push(wrapperLi);
  }

  return items;
}

function buildGroupSection(group, evaluated, gi) {
  const section = document.createElement("section");
  section.className = "skills-group";

  const stars    = ratingToStars(evaluated.rating);
  const showWeak = evaluated.min < evaluated.rating - WEAK_THRESHOLD;

  const weakBadge = showWeak
    ? `<span class="skill-weak" title="Слабое место: ${evaluated.min.toFixed(1)} из 10">↓ ${evaluated.min.toFixed(1)}</span>`
    : "";

  const header = document.createElement("div");
  header.className = "skills-group__header";
  header.innerHTML = `
    <h2>${group.name}</h2>
    <span class="skill-meta">
      ${weakBadge}
      <span class="stars" style="--rating: ${stars}"
            aria-label="${evaluated.rating.toFixed(1)} из 10"></span>
    </span>
  `;
  section.appendChild(header);

  const ul = document.createElement("ul");
  ul.className = "skills-list";
  group.children.forEach((child, i) => {
    renderSkill(child, evaluated.children[i], `g${gi}`, 0)
      .forEach(el => ul.appendChild(el));
  });
  section.appendChild(ul);

  return section;
}

function renderSkills(evals) {
  const wrapper = document.getElementById("skills-wrapper");
  wrapper.innerHTML = "";

  const hardSections = [];
  const softSections = [];

  skillsData.forEach((group, gi) => {
    const evaluated = evals[gi];
    if (!evaluated.visible) return;

    const section = buildGroupSection(group, evaluated, gi);
    if (group.category === "soft") softSections.push(section);
    else                            hardSections.push(section);
  });

  if (hardSections.length === 0 && softSections.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Для выбранных ролей навыки не найдены.";
    wrapper.appendChild(empty);
    return;
  }

  hardSections.forEach(s => wrapper.appendChild(s));

  if (hardSections.length > 0 && softSections.length > 0) {
    const divider = document.createElement("div");
    divider.className = "skills-divider";
    divider.innerHTML = `<span>Soft skills</span>`;
    wrapper.appendChild(divider);
  }

  softSections.forEach(s => wrapper.appendChild(s));
}

/* ========== Рендер навигации ========== */

function renderRolesNav() {
  const nav = document.getElementById("roles-nav");
  nav.innerHTML = "";

  const scores = computeRoleScores();

  let list = Object.entries(roles)
    .filter(([key]) => key !== "all")
    .map(([key, label]) => ({ key, label, score: scores[key] ?? 0 }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(r => r.label.toLowerCase().includes(q));
  }

  const total = list.length;
  const shown = (rolesExpanded || searchQuery)
    ? list
    : list.slice(0, TOP_N);

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "role-btn role-btn--all" +
    (activeRoles.size === 0 ? " is-active" : "");
  allBtn.textContent = roles.all;
  allBtn.addEventListener("click", () => {
    if (activeRoles.size === 0) return;
    activeRoles.clear();
    render();
  });
  nav.appendChild(allBtn);

  shown.forEach(({ key, label, score }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-btn" + (activeRoles.has(key) ? " is-active" : "");
    btn.title = `${label} — ${score.toFixed(1)} из 10`;
    btn.setAttribute("aria-pressed", String(activeRoles.has(key)));
    btn.innerHTML = `
      <span class="role-btn__label">${label}</span>
      <span class="role-btn__score">${score.toFixed(1)}</span>
    `;
    btn.addEventListener("click", () => {
      if (activeRoles.has(key)) activeRoles.delete(key);
      else                      activeRoles.add(key);
      render();
    });
    nav.appendChild(btn);
  });

  if (total === 0) {
    const hint = document.createElement("span");
    hint.className = "roles-nav__hint";
    hint.textContent = "Роль не найдена";
    nav.appendChild(hint);
    return;
  }

  if (!searchQuery && (rolesExpanded || total > TOP_N)) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "role-btn role-btn--toggle";
    toggle.setAttribute("aria-expanded", String(rolesExpanded));
    toggle.textContent = rolesExpanded
      ? "Свернуть"
      : `Показать все (${total})`;

    toggle.addEventListener("click", () => {
      rolesExpanded = !rolesExpanded;
      renderRolesNav();
    });
    nav.appendChild(toggle);
  }
}

/* ========== Сводка ========== */

function renderSummary() {
  const box = document.getElementById("roles-summary");

  if (activeRoles.size === 0) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }

  const leaves = collectVisibleLeaves();
  const count  = leaves.length;

  if (count === 0) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }

  const sum   = leaves.reduce((s, l) => s + (l.rating ?? 0), 0);
  const avg   = sum / count;
  const stars = ratingToStars(avg);

  const labels = [...activeRoles]
    .map(k => roles[k] ?? k)
    .sort()
    .join(" + ");

  let profile;
  if (avg >= 7 && count >= 8)       profile = "Сильный широкий профиль";
  else if (avg >= 7)                profile = "Сильный узкий профиль";
  else if (count >= 8)              profile = "Широкий, но средний уровень";
  else if (avg < 4)                 profile = "Базовый уровень";
  else                              profile = "Средний профиль";

  box.hidden = false;
  box.innerHTML = `
    <div class="roles-summary__head">
      <span class="roles-summary__label">Выбранные роли:</span>
      <span class="roles-summary__roles">${labels}</span>
    </div>

    <div class="roles-summary__grid">
      <div class="roles-summary__metric">
        <span class="roles-summary__metric-value">${count}</span>
        <span class="roles-summary__metric-label">навыков</span>
      </div>
      <div class="roles-summary__metric">
        <span class="roles-summary__metric-value">${avg.toFixed(2)}</span>
        <span class="roles-summary__metric-label">средний балл</span>
        <span class="stars" style="--rating: ${stars}"
              aria-label="${avg.toFixed(1)} из 10"></span>
      </div>
      <div class="roles-summary__metric">
        <span class="roles-summary__metric-value">${sum.toFixed(1)}</span>
        <span class="roles-summary__metric-label">сумма баллов</span>
      </div>
      <div class="roles-summary__metric">
        <span class="roles-summary__metric-value">${profile}</span>
        <span class="roles-summary__metric-label">профиль</span>
      </div>
    </div>
  `;
}

/* ========== Хинт под радаром ========== */

function renderRadarHint() {
  const hint = document.getElementById("radar-hint");
  if (!hint) return;
  if (activeRoles.size === 0) {
    hint.textContent = "Все навыки";
  } else {
    hint.textContent = [...activeRoles].map(k => roles[k] ?? k).sort().join(" + ");
  }
}

/* ========== Общий рендер ========== */

function render() {
  const evals = skillsData.map(evaluate);

  renderRolesNav();
  renderSummary();
  renderRadarHint();
  renderSkills(evals);
  renderRadars(evals);
  writeHash();
}

/* ========== Инициализация ========== */

function init() {
  readHash();

  // Поиск роли
  const search = document.getElementById("roles-search");
  if (search) {
    search.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderRolesNav();
    });
  }

  // PDF
  const printBtn = document.getElementById("print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  // Рубрика
  const rubricBtn  = document.getElementById("rubric-toggle");
  const rubricBody = document.getElementById("rubric-body");
  if (rubricBtn && rubricBody) {
    rubricBtn.addEventListener("click", () => {
      const open = !rubricBody.hidden;
      rubricBody.hidden = open;
      rubricBtn.setAttribute("aria-expanded", String(!open));
    });
  }

  // Аккордеон — делегирование
  const wrapper = document.getElementById("skills-wrapper");
  if (wrapper) {
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".skill-toggle");
      if (!btn) return;
      const key = btn.dataset.key;
      if (!key) return;
      if (expandedNodes.has(key)) expandedNodes.delete(key);
      else                        expandedNodes.add(key);
      render();
    });
  }

  // Тултипы радаров
  attachRadarTooltips(document.getElementById("radar-hard"));
  attachRadarTooltips(document.getElementById("radar-soft"));

  // Глобальный сторож
  document.addEventListener("mousemove", (e) => {
    const el = document.getElementById("radar-tooltip");
    if (!el || el.hidden) return;

    const canvases = [
      document.getElementById("radar-hard"),
      document.getElementById("radar-soft"),
    ];

    const inside = canvases.some(c => {
      if (!c) return false;
      const r = c.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right &&
             e.clientY >= r.top  && e.clientY <= r.bottom;
    });

    if (!inside) el.hidden = true;
  });

  window.addEventListener("scroll", () => {
    const el = document.getElementById("radar-tooltip");
    if (el) el.hidden = true;
  }, { passive: true });

  window.addEventListener("blur", () => {
    const el = document.getElementById("radar-tooltip");
    if (el) el.hidden = true;
  });

  // Resize — перерисовка радаров
  window.addEventListener("resize", () => {
    const evals = skillsData.map(evaluate);
    renderRadars(evals);
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}