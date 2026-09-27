import { ratingToStars, evaluate, markWeakLeaves } from "../js/logic.js";
import { state } from "../js/state.js";
import { getRolesForDomain, roles } from "../js/data.js";

/* ========== Мини-фреймворк ========== */

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assertion failed");
}

function eq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${msg || "eq"}: получено ${a}, ожидалось ${b}`);
}

/* Временно подменить поля state и восстановить после */
function withState(patch, fn) {
  const saved = {
    activeRoles:   new Set(state.activeRoles),
    activeDomain:  state.activeDomain,
  };
  if (patch.activeRoles) {
    state.activeRoles = new Set(patch.activeRoles);
  }
  if (patch.activeDomain !== undefined) {
    state.activeDomain = patch.activeDomain;
  }
  try {
    return fn();
  } finally {
    state.activeRoles  = saved.activeRoles;
    state.activeDomain = saved.activeDomain;
  }
}

/* ========== ratingToStars ========== */

test("ratingToStars: 0 → 0",           () => eq(ratingToStars(0),    0));
test("ratingToStars: 1 → 0.5",         () => eq(ratingToStars(1),    0.5));
test("ratingToStars: 2 → 1",           () => eq(ratingToStars(2),    1));
test("ratingToStars: 5 → 2.5",         () => eq(ratingToStars(5),    2.5));
test("ratingToStars: 8.7 → 4 (вниз)",  () => eq(ratingToStars(8.7),  4));
test("ratingToStars: 9.9 → 4.5 (вниз)",() => eq(ratingToStars(9.9),  4.5));
test("ratingToStars: 10 → 5",          () => eq(ratingToStars(10),   5));

test("ratingToStars: результат всегда кратен 0.5", () => {
  for (let v = 0; v <= 10; v += 0.13) {
    const s = ratingToStars(v);
    assert(s * 2 === Math.floor(s * 2), `не кратно 0.5: ${v} → ${s}`);
  }
});

test("ratingToStars: результат всегда в [0, 5]", () => {
  for (let v = 0; v <= 10; v += 0.07) {
    const s = ratingToStars(v);
    assert(s >= 0 && s <= 5, `вне диапазона: ${v} → ${s}`);
  }
});

/* ========== getRolesForDomain ========== */

test("getRolesForDomain('all') возвращает все роли кроме 'all'", () => {
  const all = getRolesForDomain("all");
  assert(!all.includes("all"), "в списке не должно быть ключа 'all'");
  const expected = Object.keys(roles).filter(k => k !== "all");
  eq(all.sort(), expected.sort());
});

test("getRolesForDomain('it') не пустой", () => {
  const it = getRolesForDomain("it");
  assert(it.length > 0);
  assert(it.includes("backend"));
});

test("getRolesForDomain('nonexistent') → пустой массив", () => {
  eq(getRolesForDomain("nonexistent"), []);
});

/* ========== evaluate — на ручных данных ========== */

test("evaluate: лист возвращает свой rating", () => {
  const node = { name: "X", rating: 7, roles: [] };
  const ev = evaluate(node);
  eq(ev.rating, 7);
  eq(ev.min,    7);
  eq(ev.isWeak, false);
  eq(ev.children, []);
});

test("evaluate: ветка считает среднее по детям", () => {
  const node = {
    name: "Group",
    children: [
      { name: "A", rating: 8, roles: [] },
      { name: "B", rating: 4, roles: [] },
    ],
  };
  const ev = evaluate(node);
  eq(ev.rating, 6);
  eq(ev.min, 4);
});

test("evaluate: min — минимум по всем листьям рекурсивно", () => {
  const node = {
    name: "Root",
    children: [
      {
        name: "Branch",
        children: [
          { name: "A", rating: 9, roles: [] },
          { name: "B", rating: 2, roles: [] },
        ],
      },
      { name: "C", rating: 5, roles: [] },
    ],
  };
  const ev = evaluate(node);
  eq(ev.min, 2);
  eq(ev.rating, (9 + 2 + 5) / 3);
});

test("evaluate: невидимые дети не влияют на среднее", () => {
  withState({ activeRoles: ["backend"] }, () => {
    const node = {
      name: "Root",
      children: [
        { name: "A", rating: 9, roles: ["backend"] },
        { name: "B", rating: 1, roles: ["frontend"] },
      ],
    };
    const ev = evaluate(node);
    eq(ev.rating, 9);
    eq(ev.visible, true);
  });
});

test("evaluate: если все дети невидимы — ветка невидима", () => {
  withState({ activeRoles: ["backend"] }, () => {
    const node = {
      name: "Root",
      children: [
        { name: "A", rating: 9, roles: ["frontend"] },
        { name: "B", rating: 1, roles: ["designer"] },
      ],
    };
    const ev = evaluate(node);
    eq(ev.visible, false);
  });
});

/* ========== markWeakLeaves ========== */

test("markWeakLeaves: помечает лист ниже среднего родителя", () => {
  const evals = [{
    visible: true, rating: 6, min: 2, children: [
      { visible: true, rating: 9, min: 9, children: [], isWeak: false },
      { visible: true, rating: 3, min: 3, children: [], isWeak: false }, // 3 < 6 - 1.5
    ],
  }];
  markWeakLeaves(evals);
  eq(evals[0].children[0].isWeak, false);
  eq(evals[0].children[1].isWeak, true);
});

test("markWeakLeaves: не помечает, если разница < порога", () => {
  const evals = [{
    visible: true, rating: 5, min: 5, children: [
      { visible: true, rating: 5, min: 5, children: [], isWeak: false },
      { visible: true, rating: 4, min: 4, children: [], isWeak: false }, // 4 > 5 - 1.5
    ],
  }];
  markWeakLeaves(evals);
  eq(evals[0].children[1].isWeak, false);
});

test("markWeakLeaves: рекурсия внутрь веток", () => {
  const evals = [{
    visible: true, rating: 6, min: 1, children: [{
      visible: true, rating: 5, min: 1, children: [
        { visible: true, rating: 1, min: 1, children: [], isWeak: false }, // 1 < 5 - 1.5
      ],
    }],
  }];
  markWeakLeaves(evals);
  eq(evals[0].children[0].children[0].isWeak, true);
});

/* ========== Раннер ========== */

async function run() {
  const output = document.getElementById("output");
  const summaryEl = document.getElementById("summary");

  let pass = 0, fail = 0;
  const groups = new Map(); // первое слово до ":" как группа

  for (const t of tests) {
    const groupName = t.name.split(":")[0];
    if (!groups.has(groupName)) groups.set(groupName, []);
    let result;
    try {
      await t.fn();
      pass++;
      result = { ok: true };
    } catch (e) {
      fail++;
      result = { ok: false, error: e.message };
    }
    groups.get(groupName).push({ name: t.name, ...result });
  }

  output.innerHTML = "";
  for (const [groupName, items] of groups) {
    const title = document.createElement("div");
    title.className = "test-group-title";
    title.textContent = groupName;
    output.appendChild(title);

    const ul = document.createElement("ul");
    ul.className = "test-list";

    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "test-item test-item--" + (item.ok ? "pass" : "fail");
      li.innerHTML = `
        <span class="test-icon">${item.ok ? "✓" : "✗"}</span>
        <span class="test-name">
          ${item.name}
          ${item.ok ? "" : `<span class="test-error">${item.error}</span>`}
        </span>
      `;
      ul.appendChild(li);
    });

    output.appendChild(ul);
  }

  const total = tests.length;
  summaryEl.className = "summary " + (fail === 0 ? "is-pass" : "is-fail");
  summaryEl.innerHTML =
    `<strong class="total">${pass}</strong> из <strong>${total}</strong> прошли` +
    (fail ? ` · <strong style="color:#c0392b">${fail} упали</strong>` : "");
}

run();