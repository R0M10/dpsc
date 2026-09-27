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

/* ========== Реестр типов навыков ==========
   Здесь описано, ЧЕМ один навык отличается от другого:
     - defaultRoles: какие роли подставлять, если у листа не заданы явно
     - rubric:      какая рубрика оценки применяется (пока только справочно)
     - fields:      какие характеристики ожидаются в meta (справочно)
     - display:     как отображать узел в UI
*/
const skillTypes = {
  generic: {
    label: "Навык",
    defaultRoles: [],
    rubric: "common",
    fields: [],
    display: { showBadge: true },
  },
  category: {
    label: "Категория",
    defaultRoles: [],
    rubric: "common",
    fields: [],
    display: { showBadge: true },
  },
  language: {
    label: "Язык программирования",
    defaultRoles: ["backend"],
    rubric: "code",
    fields: ["paradigms", "yearsUsed"],
    display: { showBadge: true },
  },
  library: {
    label: "Библиотека",
    defaultRoles: ["backend"],
    rubric: "library",
    fields: ["version", "typicalUse"],
    display: { showBadge: false },
  },
  tool: {
    label: "Инструмент",
    defaultRoles: [],
    rubric: "tool",
    fields: [],
    display: { showBadge: true },
  },
  concept: {
    label: "Концепт",
    defaultRoles: [],
    rubric: "concept",
    fields: [],
    display: { showBadge: false },
  },
  softskill: {
    label: "Soft skill",
    defaultRoles: ALL_ROLES,
    rubric: "soft",
    fields: ["contexts"],
    display: { showBadge: false },
  },
  framework: {
    label: "Фреймворк",
    defaultRoles: ["backend"],
    rubric: "library",
    fields: ["version", "stack"],
    display: { showBadge: true },
  },
};

/* ========== Данные ==========
   Лист:   { name, rating, roles?, type?, meta?, children? }
   Ветка:  { name, children, category?, short?, type?, meta? }
   
   type — ключ из skillTypes. Если не задан, наследуется от родителя,
   а у корня падает в "generic".
   roles — если не заданы, берутся из типа (defaultRoles). */
const skillsData = [
  /* ---------- HARD ---------- */
  {
    name: "Веб-разработка",
    short: "Веб",
    category: "hard",
    type: "category",
    children: [
      { name: "HTML", rating: 3, type: "tool", roles: ["frontend", "fullstack", "designer"] },
      { name: "CSS",  rating: 1, type: "tool", roles: ["frontend", "fullstack", "designer"] },
      { name: "PHP", rating: 3, type: "language", roles: ["fullstack", "backend"]},
      {
        name: "JavaScript",
        type: "language",
        meta: { paradigms: ["OOP", "FP"], yearsUsed: 3 },
        children: [
          { name: "Основы",    rating: 3, roles: ["frontend", "fullstack"] },
          { name: "DOM",       rating: 2, type: "concept", roles: ["frontend"] },
          { name: "Fetch/API", rating: 0, type: "concept", roles: ["frontend", "backend", "fullstack"] },
        ],
      },
    ],
  },
  {
    name: "Программирование",
    short: "Код",
    category: "hard",
    type: "category",
    children: [
      {
        name: "Python",
        type: "language",
        meta: { paradigms: ["OOP", "FP"], yearsUsed: 3 },
        children: [
          {
            name: "Язык",
            type: "category",
            children: [
              { name: "Типы и операции", rating: 8.5, type: "concept", roles: ["backend", "analyst", "data", "devops"] },
              { name: "Синтаксис",       rating: 8.0, type: "concept", roles: ["backend", "analyst", "data", "devops"] },
              { name: "Функции",         rating: 7.0, type: "concept", roles: ["backend", "analyst", "data"] },
              { name: "ООП",             rating: 6.0, type: "concept", roles: ["backend", "data"] },
              { name: "Асинхронность",   rating: 2.0, type: "concept", roles: ["backend"] },
            ],
          },
          {
            name: "Инструменты",
            type: "category",
            children: [
              { name: "venv / poetry", rating: 2.0, type: "tool", roles: ["backend", "devops"] },
              { name: "pytest",        rating: 0.0, type: "tool", roles: ["backend"] },
              { name: "mypy / ruff",   rating: 0.0, type: "tool", roles: ["backend"] },
            ],
          },
          {
            name: "Библиотеки",
            type: "category",
            children: [
              { name: "pandas",     rating: 7.0, type: "library", roles: ["analyst", "data"] },
              { name: "numpy",      rating: 5.0, type: "library", roles: ["analyst", "data"] },
              { name: "matplotlib", rating: 4.0, type: "library", roles: ["analyst", "data"] },
              { name: "tkinter", rating: 3.0, type: 'library', roles: ["analyst", "data","designer"]},
            ],
          },
        ],
      },
      { name: "Django", rating: 2, type: "framework", roles: ["backend", "fullstack",] },
      { name: "Git",    rating: 3, type: "tool",    roles: ["frontend", "backend", "devops", "fullstack"] },
    ],
  },
  {
    name: "Офисный пакет",
    short: "Офис",
    category: "hard",
    type: "category",
    children: [
      { name: "Excel",      rating: 10, type: "tool", roles: ["office", "analyst", "pm"] },
      { name: "Word",       rating: 9,  type: "tool", roles: ["office", "pm"] },
      { name: "PowerPoint", rating: 7,  type: "tool", roles: ["office", "pm"] },
      { name: "Project", rating: 4, type: "tool", roles: ["office","pm"]},
      { name: "Power Query", rating: 7.5, type: "tool", roles: ["office", "data"]},
    ],
  },
  {
    name: "Аналитика",
    short: "Data",
    category: "hard",
    type: "category",
    children: [
      { name: "SQL",     rating: 7, type: "language", roles: ["analyst", "backend", "data"] },
      { name: "Pandas",  rating: 4, type: "library",  roles: ["analyst", "data"] },
      { name: "PowerBI", rating: 5, type: "tool",     roles: ["analyst", "data", "pm"] },
      { name: "BPMN", rating: 4.5, type: "tool", roles: ["analyst", "data", "pm"] }, // BPMN (Business Process Model and Notation) 
      { name: "UML", rating: 2.0, type: "tool", roles: ["analyst", "data", "pm"] }, // UML (Unified Modeling Language) 
      { name: "EPC", rating: 0.1, type: "tool", roles: ["analyst", "data", "pm"] }, // Event-driven Process Chain (событийная цепочка процессов)
    ],
  },
  {
    name: "Инфраструктура",
    short: "Инфра",
    category: "hard",
    type: "category",
    children: [
      { name: "Docker", rating: 2, type: "tool", roles: ["devops", "backend"] },
      { name: "CI/CD",  rating: 1, type: "tool", roles: ["devops"] },
      { name: "Linux",  rating: 6, type: "tool", roles: ["devops", "backend"] },
      { name: "Kubernetes", rating:1, type: "tool", roles: ["devops", "backend"]}
    ],
  },

  /* ---------- SOFT ----------
     Тип задаётся один раз на верхнем уровне — дети наследуют. */
  {
    name: "Эмоциональный интеллект",
    short: "EQ",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Самосознание",        rating: 8 },
      { name: "Эмпатия",             rating: 8.5 },
      { name: "Управление эмоциями", rating: 7 },
    ],
  },
  {
    name: "Лидерство",
    short: "Лидер",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Делегирование",     rating: 5.9 },
      { name: "Мотивация команды", rating: 7 },
      { name: "Принятие решений",  rating: 7 },
    ],
  },
  {
    name: "Публичная презентация",
    short: "Речь",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Структура выступления", rating: 8 },
      { name: "Работа с аудиторией",   rating: 8 },
      { name: "Визуализация",          rating: 7 },
    ],
  },
  {
    name: "Креативность",
    short: "Креатив",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Генерация идей",         rating: 8 },
      { name: "Нестандартное мышление", rating: 8.5 },
      { name: "Дизайн-мышление",        rating: 5 },
    ],
  },
  {
    name: "Тайм-менеджмент",
    short: "Время",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Планирование",        rating: 7 },
      { name: "Приоритизация",       rating: 6 },
      { name: "Управление задачами", rating: 7 },
    ],
  },
  {
    name: "Критическое мышление",
    short: "Крит.",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Анализ",            rating: 8 },
      { name: "Логика",            rating: 7 },
      { name: "Скорость мышления", rating: 7.8},
      { name: "Оценка источников", rating: 6 },
    ],
  },
  {
    name: "Переговоры",
    short: "Перег.",
    category: "soft",
    type: "softskill",
    children: [
      { name: "Подготовка",         rating: 6 },
      { name: "Аргументация",       rating: 6 },
      { name: "Поиск компромиссов", rating: 7 },
    ],
  },
];

/* ========== Настройки ========== */
const TOP_N = 8;
const WEAK_THRESHOLD = 1.5;

/* ========== Состояние ========== */
const activeRoles   = new Set();
const expandedNodes = new Set();
let   rolesExpanded = false;
let   searchQuery   = "";

/* ========== Разрешение типа ==========
   Возвращает НОВЫЙ объект: копия node + подставленные roles/meta
   + поля _type и _typeDef. Оригинал не мутируется. */
function resolveSkill(node, parentType = null) {
  const typeKey = node.type || parentType || "generic";
  const typeDef = skillTypes[typeKey] || skillTypes.generic;

  return {
    ...node,
    roles: node.roles ?? typeDef.defaultRoles ?? [],
    meta:  node.meta  ?? {},
    _type:    typeKey,
    _typeDef: typeDef,
  };
}

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

/* Рекурсивно обходит дерево. Внутри сам вызывает resolveSkill,
   чтобы дети получили унаследованный тип. */
function evaluate(node, parentType = null) {
  const resolved = resolveSkill(node, parentType);
  const typeKey  = resolved._type;

  // Лист
  if (!node.children || !node.children.length) {
    const visible = isLeafVisible(resolved);
    const value   = visible ? (resolved.rating ?? 0) : 0;
    return {
      visible,
      rating: value,
      min:    value,
      isWeak: false,
      children: [],
      _type:    typeKey,
      _typeDef: resolved._typeDef,
      _meta:    resolved.meta,
      _roles:   resolved.roles,
    };
  }

  // Ветка
  const evaluatedChildren = node.children.map(c => evaluate(c, typeKey));
  const visibleChildren   = evaluatedChildren.filter(c => c.visible);

  const visible = visibleChildren.length > 0;
  const rating  = visible
    ? visibleChildren.reduce((s, c) => s + c.rating, 0) / visibleChildren.length
    : 0;
  const min = visible
    ? Math.min(...visibleChildren.map(c => c.min))
    : 0;

  return {
    visible,
    rating,
    min,
    isWeak: false,
    children: evaluatedChildren,
    _type:    typeKey,
    _typeDef: resolved._typeDef,
    _meta:    resolved.meta,
    _roles:   resolved.roles,
  };
}

/* Проходит по дереву сверху вниз и помечает ЛИСТЬЯ, чей рейтинг
   заметно ниже среднего у их непосредственной родительской ветки.
   Так бейдж «слабое звено» появляется у самого виновника,
   а не у родителя. */
function markWeakLeaves(nodes, parentAvg = null) {
  nodes.forEach(node => {
    if (!node.visible) return;

    if (node.children && node.children.length) {
      // Ветка — идём внутрь с её средним
      markWeakLeaves(node.children, node.rating);
      return;
    }

    // Лист — сравниваем со средним ближайшего родителя
    if (parentAvg != null && node.rating < parentAvg - WEAK_THRESHOLD) {
      node.isWeak = true;
    }
  });
}

function collectVisibleLeaves() {
  const result = [];
  function walk(node, parentType = null) {
    const resolved = resolveSkill(node, parentType);
    if (node.children && node.children.length) {
      node.children.forEach(c => walk(c, resolved._type));
      return;
    }
    if (isLeafVisible(resolved)) result.push(resolved);
  }
  skillsData.forEach(g => walk(g));
  return result;
}

function computeRoleScores() {
  const acc = {};
  function walk(node, parentType = null) {
    const resolved = resolveSkill(node, parentType);
    if (node.children && node.children.length) {
      node.children.forEach(c => walk(c, resolved._type));
      return;
    }
    if (Array.isArray(resolved.roles)) {
      resolved.roles.forEach(r => {
        if (!acc[r]) acc[r] = { sum: 0, count: 0 };
        acc[r].sum   += resolved.rating ?? 0;
        acc[r].count += 1;
      });
    }
  }
  skillsData.forEach(g => walk(g));

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
    if (canvas.getContext) canvas.width = canvas.height = 0;
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

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  }
  ctx.stroke();

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
    const typeLabel   = item.eval._typeDef?.label ?? "";

    el.innerHTML = `
      <span class="radar-tooltip__name">${item.group.name}</span>
      ${typeLabel ? `<span class="radar-tooltip__type">${typeLabel}</span>` : ""}
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

/* ========== Рендер навыков ========== */

function renderSkill(node, evaluated, path = "", level = 0) {
  if (!evaluated.visible) return [];

  const key         = path ? `${path}/${node.name}` : node.name;
  const stars       = ratingToStars(evaluated.rating);
  const hasChildren = evaluated.children.some(c => c.visible);
  const isExpanded  = hasChildren && expandedNodes.has(key);

  // Тип решает, показывать ли бейдж слабого места
  const typeDisplay = evaluated._typeDef?.display ?? {};
  const showBadgeAllowed = typeDisplay.showBadge !== false;
  // Бейдж «слабое звено» — только у листьев, которые markWeakLeaves помечает
  const showWeak = !hasChildren
    && evaluated.isWeak === true
    && (evaluated._typeDef?.display?.showBadge !== false);

  const li = document.createElement("li");
  li.className = "skill" +
    (hasChildren ? " skill--has-children" : "") +
    (isExpanded  ? " skill--expanded"     : "");
  li.dataset.type = evaluated._type;   // полезно для отладки и CSS-хуков

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
  section.dataset.type = evaluated._type;

  const stars = ratingToStars(evaluated.rating);

  const header = document.createElement("div");
  header.className = "skills-group__header";
  header.innerHTML = `
    <h2>${group.name}</h2>
    <span class="skill-meta">
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

/* ========== Навигация по ролям ========== */

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


  // Уровень — по среднему баллу
  let level;
  if (avg >= 8.5)       level = "Expert";
  else if (avg >= 7.0)  level = "Senior";
  else if (avg >= 5.0)  level = "Middle";
  else if (avg >= 3.0)  level = "Junior";
  else                  level = "Trainee";

  // Охват — по количеству навыков
  let scope;
  if (count >= 8)       scope = "широкий";
  else if (count >= 3)  scope = "сбалансированный";
  else                  scope = "узкий";

  // CSS-класс для цвета
  const levelClass = "lvl-" + level.toLowerCase();

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
        <span class="roles-summary__metric-value ${levelClass}">${level}</span>
        <span class="roles-summary__metric-label">${scope} профиль</span>
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
  const evals = skillsData.map(g => evaluate(g));
  markWeakLeaves(evals);   // ← новый проход: помечаем слабые листья

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

  const search = document.getElementById("roles-search");
  if (search) {
    search.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderRolesNav();
    });
  }

  const printBtn = document.getElementById("print-btn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  const rubricBtn  = document.getElementById("rubric-toggle");
  const rubricBody = document.getElementById("rubric-body");
  if (rubricBtn && rubricBody) {
    rubricBtn.addEventListener("click", () => {
      const open = !rubricBody.hidden;
      rubricBody.hidden = open;
      rubricBtn.setAttribute("aria-expanded", String(!open));
    });
  }

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

  attachRadarTooltips(document.getElementById("radar-hard"));
  attachRadarTooltips(document.getElementById("radar-soft"));

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

  window.addEventListener("resize", () => {
    const evals = skillsData.map(g => evaluate(g));
    renderRadars(evals);
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}