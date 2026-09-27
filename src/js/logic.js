import { state } from "./state.js";
import { skillTypes, skillsData, getRolesForDomain } from "./data.js";
import { WEAK_THRESHOLD } from "./config.js";

/* ========== Разрешение типа и ролей ========== */
export function resolveSkill(node, parentType = null) {
  const typeKey = node.type || parentType || "generic";
  const typeDef = skillTypes[typeKey] || skillTypes.generic;

  let resolvedRoles = node.roles;
  if (resolvedRoles == null) {
    const dr = typeDef.defaultRoles;
    resolvedRoles = dr === "DOMAIN"
      ? getRolesForDomain(state.activeDomain)
      : (dr ?? []);
  }

  return {
    ...node,
    roles: resolvedRoles,
    meta:  node.meta ?? {},
    _type:    typeKey,
    _typeDef: typeDef,
  };
}

/* ========== Вспомогательные ========== */

export function ratingToStars(rating10) {
  const raw = rating10 / 2;
  return Math.floor(raw * 2) / 2;
}

export function getVisibleGroups() {
  if (state.activeDomain === "all") return skillsData;
  return skillsData.filter(g => g.domain === state.activeDomain);
}

function isLeafVisible(node) {
  if (state.activeRoles.size === 0) return true;
  if (!Array.isArray(node.roles)) return false;
  for (const r of node.roles) {
    if (state.activeRoles.has(r)) return true;
  }
  return false;
}

/* ========== Рекурсивный обход ========== */

export function evaluate(node, parentType = null) {
  const resolved = resolveSkill(node, parentType);
  const typeKey  = resolved._type;

  if (!node.children || !node.children.length) {
    const visible = isLeafVisible(resolved);
    const value   = visible ? (resolved.rating ?? 0) : 0;
    return {
      visible, rating: value, min: value, isWeak: false,
      children: [],
      _type: typeKey, _typeDef: resolved._typeDef,
      _meta: resolved.meta, _roles: resolved.roles,
    };
  }

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
    visible, rating, min, isWeak: false,
    children: evaluatedChildren,
    _type: typeKey, _typeDef: resolved._typeDef,
    _meta: resolved.meta, _roles: resolved.roles,
  };
}

export function markWeakLeaves(nodes, parentAvg = null) {
  nodes.forEach(node => {
    if (!node.visible) return;
    if (node.children && node.children.length) {
      markWeakLeaves(node.children, node.rating);
      return;
    }
    if (parentAvg != null && node.rating < parentAvg - WEAK_THRESHOLD) {
      node.isWeak = true;
    }
  });
}

export function collectVisibleLeaves() {
  const result = [];
  getVisibleGroups().forEach(group => {
    const category = group.category || "hard";
    (function walk(node, parentType = null) {
      const resolved = resolveSkill(node, parentType);
      if (node.children && node.children.length) {
        node.children.forEach(c => walk(c, resolved._type));
        return;
      }
      if (isLeafVisible(resolved)) {
        result.push({ ...resolved, _category: category });
      }
    })(group, null);
  });
  return result;
}

export function computeRoleScores() {
  const acc = {};
  getVisibleGroups().forEach(group => {
    (function walk(node, parentType = null) {
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
    })(group, null);
  });
  const scores = {};
  for (const r in acc) scores[r] = acc[r].sum / acc[r].count;
  return scores;
}