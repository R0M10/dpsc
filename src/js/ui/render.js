import { state } from "../state.js";
import { getVisibleGroups, evaluate, markWeakLeaves } from "../logic.js";
import { writeHash } from "../hash.js";
import { renderDomainsNav, renderRolesNav } from "./nav.js";
import { renderSummary, renderRadarHint } from "./summary.js";
import { renderSkills } from "./skills.js";
import { renderRadars } from "./radar.js";

/* Единая точка перерисовки — вызывается после любого изменения state */
export function render() {
  const groups = getVisibleGroups();
  const evals  = groups.map(g => evaluate(g));
  markWeakLeaves(evals);

  renderDomainsNav();
  renderRolesNav();
  renderSummary();
  renderRadarHint();
  renderSkills(groups, evals);
  renderRadars(groups, evals);
  writeHash();
}