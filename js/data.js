/* ========== Области (домены) ========== */
export const domains = {
  all: "Все области",
  it:  "IT",
  // cooking: "Кулинария",   // ← раскомментируй, когда появятся данные
};

/* ========== Роли ========== */
export const roles = {
  all:       "Все",
  frontend:  "Frontend",
  backend:   "Backend",
  fullstack: "Fullstack",
  analyst:   "Аналитик",
  data:      "Data Scientist",
  office:    "Офис",
  devops:    "DevOps",
  qa:        "QA-инженер",
  pm:        "Project Manager",
  designer:  "UI/UX дизайнер",
  // cook:     "Повар",
  // souschef: "Су-шеф",
};

/* К какому домену относится каждая роль */
export const roleDomains = {
  frontend:  "it",
  backend:   "it",
  fullstack: "it",
  analyst:   "it",
  data:      "it",
  office:    "it",
  devops:    "it",
  qa:        "it",
  pm:        "it",
  designer:  "it",
  // cook:     "cooking",
  // souschef: "cooking",
};

/* Ключи ролей домена (или все — для "all") */
export function getRolesForDomain(domain) {
  if (domain === "all") return Object.keys(roles).filter(k => k !== "all");
  return Object.entries(roleDomains)
    .filter(([, d]) => d === domain)
    .map(([k]) => k);
}

/* ========== Реестр типов навыков ==========
   defaultRoles: массив ключей ИЛИ строка "DOMAIN" —
   тогда подставятся все роли текущего домена. */
export const skillTypes = {
  generic:   { label: "Навык",      defaultRoles: [],       rubric: "common",  fields: [],                        display: { showBadge: true  } },
  category:  { label: "Категория",  defaultRoles: [],       rubric: "common",  fields: [],                        display: { showBadge: true  } },
  language:  { label: "Язык",       defaultRoles: ["backend"], rubric: "code", fields: ["paradigms","yearsUsed"], display: { showBadge: true  } },
  library:   { label: "Библиотека", defaultRoles: ["backend"], rubric: "library", fields: ["version","typicalUse"], display: { showBadge: false } },
  tool:      { label: "Инструмент", defaultRoles: [],       rubric: "tool",    fields: [],                        display: { showBadge: true  } },
  concept:   { label: "Концепт",    defaultRoles: [],       rubric: "concept", fields: [],                        display: { showBadge: false } },
  framework: { label: "Фреймворк",  defaultRoles: ["backend"], rubric: "library", fields: ["version","stack"],   display: { showBadge: true  } },
  softskill: { label: "Soft skill", defaultRoles: "DOMAIN", rubric: "soft",    fields: ["contexts"],              display: { showBadge: false } },
};

/* ========== Скиллы ========== */
export const skillsData = [
  /* ---------- HARD ---------- */
  {
    domain: "it", category: "hard",
    name: "Веб-разработка", short: "Веб", type: "category",
    children: [
      { name: "HTML", rating: 3, type: "tool", roles: ["frontend", "fullstack", "designer"] },
      { name: "CSS",  rating: 1, type: "tool", roles: ["frontend", "fullstack", "designer"] },
      { name: "PHP",  rating: 3, type: "language", roles: ["fullstack", "backend"] },
      {
        name: "JavaScript", type: "language",
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
    domain: "it", category: "hard",
    name: "Программирование", short: "Код", type: "category",
    children: [
      {
        name: "Python", type: "language",
        meta: { paradigms: ["OOP", "FP"], yearsUsed: 3 },
        children: [
          {
            name: "Язык", type: "category",
            children: [
              { name: "Типы и операции", rating: 8.5, type: "concept", roles: ["backend", "analyst", "data", "devops"] },
              { name: "Синтаксис",       rating: 8.0, type: "concept", roles: ["backend", "analyst", "data", "devops"] },
              { name: "Функции",         rating: 7.0, type: "concept", roles: ["backend", "analyst", "data"] },
              { name: "ООП",             rating: 6.0, type: "concept", roles: ["backend", "data"] },
              { name: "Асинхронность",   rating: 2.0, type: "concept", roles: ["backend"] },
            ],
          },
          {
            name: "Инструменты", type: "category",
            children: [
              { name: "venv / poetry", rating: 2.0, type: "tool", roles: ["backend", "devops"] },
              { name: "pytest",        rating: 0.0, type: "tool", roles: ["backend"] },
              { name: "mypy / ruff",   rating: 0.0, type: "tool", roles: ["backend"] },
            ],
          },
          {
            name: "Библиотеки", type: "category",
            children: [
              { name: "pandas",     rating: 7.0, type: "library", roles: ["analyst", "data"] },
              { name: "numpy",      rating: 5.0, type: "library", roles: ["analyst", "data"] },
              { name: "matplotlib", rating: 4.0, type: "library", roles: ["analyst", "data"] },
              { name: "tkinter",    rating: 3.0, type: "library", roles: ["analyst", "data", "designer"] },
            ],
          },
        ],
      },
      { name: "Django", rating: 2, type: "framework", roles: ["backend", "fullstack"] },
      { name: "Git",    rating: 3, type: "tool",      roles: ["frontend", "backend", "devops", "fullstack"] },
    ],
  },
  {
    domain: "it", category: "hard",
    name: "Офисный пакет", short: "Офис", type: "category",
    children: [
      { name: "Excel",       rating: 10,  type: "tool", roles: ["office", "analyst", "pm"] },
      { name: "Word",        rating: 9,   type: "tool", roles: ["office", "pm"] },
      { name: "PowerPoint",  rating: 7,   type: "tool", roles: ["office", "pm"] },
      { name: "Project",     rating: 4,   type: "tool", roles: ["office", "pm"] },
      { name: "Power Query", rating: 7.5, type: "tool", roles: ["office", "data"] },
    ],
  },
  {
    domain: "it", category: "hard",
    name: "Аналитика", short: "Data", type: "category",
    children: [
      { name: "SQL",     rating: 7,   type: "language", roles: ["analyst", "backend", "data"] },
      { name: "Pandas",  rating: 4,   type: "library",  roles: ["analyst", "data"] },
      { name: "PowerBI", rating: 5,   type: "tool",     roles: ["analyst", "data", "pm"] },
      { name: "BPMN",    rating: 4.5, type: "tool",     roles: ["analyst", "data", "pm"] },
      { name: "UML",     rating: 2.0, type: "tool",     roles: ["analyst", "data", "pm"] },
      { name: "EPC",     rating: 0.1, type: "tool",     roles: ["analyst", "data", "pm"] },
    ],
  },
  {
    domain: "it", category: "hard",
    name: "Инфраструктура", short: "Инфра", type: "category",
    children: [
      { name: "Docker",     rating: 2, type: "tool", roles: ["devops", "backend"] },
      { name: "CI/CD",      rating: 1, type: "tool", roles: ["devops"] },
      { name: "Linux",      rating: 6, type: "tool", roles: ["devops", "backend"] },
      { name: "Kubernetes", rating: 1, type: "tool", roles: ["devops", "backend"] },
    ],
  },

  /* ---------- SOFT ---------- */
  {
    domain: "it", category: "soft",
    name: "Эмоциональный интеллект", short: "EQ", type: "softskill",
    children: [
      { name: "Самосознание",        rating: 8 },
      { name: "Эмпатия",             rating: 8.5 },
      { name: "Управление эмоциями", rating: 7 },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Лидерство", short: "Лидер", type: "softskill",
    children: [
      { name: "Делегирование",     rating: 5.9, roles: ["pm", "devops"] },
      { name: "Мотивация команды", rating: 7,   roles: ["pm"] },
      { name: "Принятие решений",  rating: 7 },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Публичная презентация", short: "Речь", type: "softskill",
    children: [
      { name: "Структура выступления", rating: 8 },
      { name: "Работа с аудиторией",   rating: 8 },
      { name: "Визуализация",          rating: 7, roles: ["designer", "pm"] },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Креативность", short: "Креатив", type: "softskill",
    children: [
      { name: "Генерация идей",         rating: 8 },
      { name: "Нестандартное мышление", rating: 8.5 },
      { name: "Дизайн-мышление",        rating: 5, roles: ["designer"] },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Тайм-менеджмент", short: "Время", type: "softskill",
    children: [
      { name: "Планирование",        rating: 7 },
      { name: "Приоритизация",       rating: 6 },
      { name: "Управление задачами", rating: 7 },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Критическое мышление", short: "Крит.", type: "softskill",
    children: [
      { name: "Анализ",            rating: 8 },
      { name: "Логика",            rating: 7 },
      { name: "Скорость мышления", rating: 7.8 },
      { name: "Оценка источников", rating: 6 },
    ],
  },
  {
    domain: "it", category: "soft",
    name: "Переговоры", short: "Перег.", type: "softskill",
    children: [
      { name: "Подготовка",         rating: 6 },
      { name: "Аргументация",       rating: 6 },
      { name: "Поиск компромиссов", rating: 7 },
    ],
  },
];