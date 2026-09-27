import { state } from "../state.js";
import { domains, roles, roleDomains, skillsData, getRolesForDomain } from "../data.js";
import { computeRoleScores } from "../logic.js";
import { TOP_N } from "../config.js";
import { render } from "./render.js";

/* ========== Домены ========== */

export function renderDomainsNav() {
  const nav = document.getElementById("domains-nav");
  nav.innerHTML = "";

  Object.entries(domains).forEach(([key, label]) => {
    if (key !== "all") {
      const has = skillsData.some(g => g.domain === key);
      if (!has) return;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "domain-btn" + (state.activeDomain === key ? " is-active" : "");
    btn.textContent = label;

    btn.addEventListener("click", () => {
      if (state.activeDomain === key) return;
      state.activeDomain = key;

      // Сбросить активные роли, которых нет в новом домене
      const valid = new Set(getRolesForDomain(key));
      for (const r of [...state.activeRoles]) {
        if (!valid.has(r)) state.activeRoles.delete(r);
      }

      render();
    });

    nav.appendChild(btn);
  });
}

/* ========== Роли ========== */

export function renderRolesNav() {
  const nav = document.getElementById("roles-nav");
  nav.innerHTML = "";

  const scores = computeRoleScores();

  let list = Object.entries(roles)
    .filter(([key]) => key !== "all")
    .filter(([key]) => state.activeDomain === "all" || roleDomains[key] === state.activeDomain)
    .map(([key, label]) => ({ key, label, score: scores[key] ?? 0 }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(r => r.label.toLowerCase().includes(q));
  }

  const total = list.length;
  const shown = (state.rolesExpanded || state.searchQuery) ? list : list.slice(0, TOP_N);

  // Кнопка «Все»
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "role-btn role-btn--all" +
    (state.activeRoles.size === 0 ? " is-active" : "");
  allBtn.textContent = roles.all;
  allBtn.addEventListener("click", () => {
    if (state.activeRoles.size === 0) return;
    state.activeRoles.clear();
    render();
  });
  nav.appendChild(allBtn);

  // Роли
  shown.forEach(({ key, label, score }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-btn" + (state.activeRoles.has(key) ? " is-active" : "");
    btn.title = `${label} — ${score.toFixed(1)} из 10`;
    btn.setAttribute("aria-pressed", String(state.activeRoles.has(key)));
    btn.innerHTML = `
      <span class="role-btn__label">${label}</span>
      <span class="role-btn__score">${score.toFixed(1)}</span>
    `;
    btn.addEventListener("click", () => {
      if (state.activeRoles.has(key)) state.activeRoles.delete(key);
      else                            state.activeRoles.add(key);
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

  // Свернуть/развернуть
  if (!state.searchQuery && (state.rolesExpanded || total > TOP_N)) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "role-btn role-btn--toggle";
    toggle.setAttribute("aria-expanded", String(state.rolesExpanded));
    toggle.textContent = state.rolesExpanded ? "Свернуть" : `Показать все (${total})`;

    toggle.addEventListener("click", () => {
      state.rolesExpanded = !state.rolesExpanded;
      render();
    });
    nav.appendChild(toggle);
  }
}