import { state } from "../state.js";
import { ratingToStars, collectVisibleLeaves } from "../logic.js";
import { domains, roles } from "../data.js";

export function renderSummary() {
  const box = document.getElementById("roles-summary");

  if (state.activeRoles.size === 0 && state.activeDomain === "all") {
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

  const hardLeaves = leaves.filter(l => l._category === "hard");
  const softLeaves = leaves.filter(l => l._category === "soft");

  const avgOf = arr => arr.length
    ? arr.reduce((s, l) => s + (l.rating ?? 0), 0) / arr.length
    : 0;

  const hardAvg = avgOf(hardLeaves);
  const softAvg = avgOf(softLeaves);

  const hardStars = ratingToStars(hardAvg);
  const softStars = ratingToStars(softAvg);

  const sum = leaves.reduce((s, l) => s + (l.rating ?? 0), 0);
  const avg = sum / count;

  const domainLabel = state.activeDomain !== "all" ? domains[state.activeDomain] : null;
  const roleLabels  = [...state.activeRoles].map(k => roles[k] ?? k).sort();
  const headLabel   = [domainLabel, ...roleLabels].filter(Boolean).join(" · ");

  let level;
  if (avg >= 8.5)       level = "Expert";
  else if (avg >= 7.0)  level = "Senior";
  else if (avg >= 5.0)  level = "Middle";
  else if (avg >= 3.0)  level = "Junior";
  else                  level = "Trainee";

  let scope;
  if (count >= 8)       scope = "широкий";
  else if (count >= 3)  scope = "сбалансированный";
  else                  scope = "узкий";

  const levelClass = "lvl-" + level.toLowerCase();

  box.hidden = false;
  box.innerHTML = `
    <div class="roles-summary__head">
      <span class="roles-summary__label">Фильтр:</span>
      <span class="roles-summary__roles">${headLabel || "всё"}</span>
    </div>

    <div class="roles-summary__grid">
      <div class="roles-summary__metric roles-summary__metric--hard">
        <span class="roles-summary__metric-label">Hard skills</span>
        <span class="roles-summary__metric-value">${hardLeaves.length ? hardAvg.toFixed(2) : "—"}</span>
        ${hardLeaves.length
          ? `<span class="stars" style="--rating: ${hardStars}"></span>
             <span class="roles-summary__metric-sub">${hardLeaves.length} навыков</span>`
          : `<span class="roles-summary__metric-sub">нет</span>`}
      </div>

      <div class="roles-summary__metric roles-summary__metric--soft">
        <span class="roles-summary__metric-label">Soft skills</span>
        <span class="roles-summary__metric-value">${softLeaves.length ? softAvg.toFixed(2) : "—"}</span>
        ${softLeaves.length
          ? `<span class="stars" style="--rating: ${softStars}"></span>
             <span class="roles-summary__metric-sub">${softLeaves.length} навыков</span>`
          : `<span class="roles-summary__metric-sub">нет</span>`}
      </div>

      <div class="roles-summary__metric">
        <span class="roles-summary__metric-label">Сумма баллов</span>
        <span class="roles-summary__metric-value">${sum.toFixed(1)}</span>
        <span class="roles-summary__metric-sub">${count} навыков</span>
      </div>

      <div class="roles-summary__metric">
        <span class="roles-summary__metric-label">${scope} профиль</span>
        <span class="roles-summary__metric-value ${levelClass}">${level}</span>
        <span class="roles-summary__metric-sub">общий уровень</span>
      </div>
    </div>
  `;
}

export function renderRadarHint() {
  const hint = document.getElementById("radar-hint");
  if (!hint) return;

  const parts = [];
  if (state.activeDomain !== "all") parts.push(domains[state.activeDomain]);
  if (state.activeRoles.size > 0) {
    parts.push([...state.activeRoles].map(k => roles[k] ?? k).sort().join(" + "));
  }
  hint.textContent = parts.length ? parts.join(" · ") : "Все навыки";
}