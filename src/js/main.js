import { state } from "./state.js";
import { readHash } from "./hash.js";
import { getVisibleGroups, evaluate } from "./logic.js";
import { render } from "./ui/render.js";
import { attachSkillsListeners } from "./ui/skills.js";
import { renderRadars, attachGlobalTooltipGuard } from "./ui/radar.js";
import { reportValidation } from "./validate.js";
import { exportJSON } from "./export.js";

function init() {
  // 0. Валидация данных — до первого рендера
  reportValidation();

  // 1. Прочитать хэш
  readHash();

  // 2. Поиск роли
  const search = document.getElementById("roles-search");
  if (search) {
    search.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      render();
    });
  }

  // 3. Кнопка PDF
  const printBtn = document.getElementById("print-btn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  // 4. Экспорт JSON (скачать)
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) exportBtn.addEventListener("click", exportJSON);

  // 5. Раскрытие рубрики
  const rubricBtn  = document.getElementById("rubric-toggle");
  const rubricBody = document.getElementById("rubric-body");
  if (rubricBtn && rubricBody) {
    rubricBtn.addEventListener("click", () => {
      const open = !rubricBody.hidden;
      rubricBody.hidden = open;
      rubricBtn.setAttribute("aria-expanded", String(!open));
    });
  }

  // 6. Аккордеон навыков
  attachSkillsListeners();

  // 7. Глобальный сторож тултипа
  attachGlobalTooltipGuard();

  // 8. Ресайз
  window.addEventListener("resize", () => {
    const groups = getVisibleGroups();
    const evals  = groups.map(g => evaluate(g));
    renderRadars(groups, evals);
  });

  // 9. Первый рендер
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}