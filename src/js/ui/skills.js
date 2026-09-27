import { state } from "../state.js";
import { ratingToStars } from "../logic.js";
import { render } from "./render.js";

function renderSkill(node, evaluated, path = "") {
  if (!evaluated.visible) return [];

  const key         = path ? `${path}/${node.name}` : node.name;
  const stars       = ratingToStars(evaluated.rating);
  const hasChildren = evaluated.children.some(c => c.visible);
  const isExpanded  = hasChildren && state.expandedNodes.has(key);

  const showWeak = !hasChildren
    && evaluated.isWeak === true
    && (evaluated._typeDef?.display?.showBadge !== false);

  const li = document.createElement("li");
  li.className = "skill" +
    (hasChildren ? " skill--has-children" : "") +
    (isExpanded  ? " skill--expanded"     : "");
  li.dataset.type = evaluated._type;

  let namePart;
  if (hasChildren) {
    namePart = `
      <button type="button" class="skill-toggle" data-key="${key}" aria-expanded="${isExpanded}">
        <span class="skill-caret" aria-hidden="true"></span>
        <span class="skill-name">${node.name}</span>
      </button>
    `;
  } else {
    namePart = `<span class="skill-name">${node.name}</span>`;
  }

  const weakBadge = showWeak
    ? `<span class="skill-weak" title="Слабое звено: ${evaluated.rating.toFixed(1)} из 10">↓ ${evaluated.rating.toFixed(1)}</span>`
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
      renderSkill(child, evaluated.children[i], key)
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
  section.dataset.domain = group.domain || "";

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
    renderSkill(child, evaluated.children[i], `g${gi}`)
      .forEach(el => ul.appendChild(el));
  });
  section.appendChild(ul);

  return section;
}

export function renderSkills(groups, evals) {
  const wrapper = document.getElementById("skills-wrapper");
  wrapper.innerHTML = "";

  const hardSections = [];
  const softSections = [];

  groups.forEach((group, gi) => {
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

/* Делегированный обработчик — навешиваем один раз из main.js */
export function attachSkillsListeners() {
  const wrapper = document.getElementById("skills-wrapper");
  if (!wrapper) return;

  wrapper.addEventListener("click", (e) => {
    const btn = e.target.closest(".skill-toggle");
    if (!btn) return;
    const key = btn.dataset.key;
    if (!key) return;

    if (state.expandedNodes.has(key)) state.expandedNodes.delete(key);
    else                              state.expandedNodes.add(key);

    render();
  });
}