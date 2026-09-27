import { roles, domains, skillTypes, roleDomains, skillsData } from "./data.js";

/* Возвращает массив issues: { level: "error"|"warn", path, msg } */
export function validateSkillsData() {
  const issues = [];
  const validRoleKeys   = new Set(Object.keys(roles).filter(k => k !== "all"));
  const validDomainKeys = new Set(Object.keys(domains).filter(k => k !== "all"));
  const validTypeKeys   = new Set(Object.keys(skillTypes));

  function walk(node, path, isRoot) {
    const here = path ? `${path} / ${node.name}` : node.name;

    if (!node.name || typeof node.name !== "string") {
      issues.push({ level: "error", path: here, msg: "Отсутствует name" });
    }

    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const hasRating   = node.rating != null;

    if (!hasChildren && !hasRating) {
      issues.push({ level: "error", path: here, msg: "Ни children, ни rating" });
      return;
    }

    if (hasChildren && hasRating) {
      issues.push({ level: "warn", path: here, msg: "Есть и children, и rating — rating будет проигнорирован" });
    }

    if (node.type != null && !validTypeKeys.has(node.type)) {
      issues.push({ level: "error", path: here, msg: `Неизвестный type: "${node.type}"` });
    }

    if (isRoot) {
      if (!validDomainKeys.has(node.domain)) {
        issues.push({ level: "error", path: here, msg: `Неизвестный domain: "${node.domain}"` });
      }
      if (node.category !== "hard" && node.category !== "soft") {
        issues.push({ level: "error", path: here, msg: `category должен быть "hard" или "soft"` });
      }
    }

    if (!hasChildren) {
      const v = node.rating;
      if (typeof v !== "number" || Number.isNaN(v)) {
        issues.push({ level: "error", path: here, msg: `rating не число: ${v}` });
      } else if (v < 0 || v > 10) {
        issues.push({ level: "warn", path: here, msg: `rating вне 0..10: ${v}` });
      }
      if (Array.isArray(node.roles)) {
        node.roles.forEach(r => {
          if (!validRoleKeys.has(r)) {
            issues.push({ level: "error", path: here, msg: `Неизвестная роль: "${r}"` });
          }
        });
      }
    }

    if (hasChildren) {
      const seen = new Set();
      node.children.forEach(child => {
        if (child.name && seen.has(child.name)) {
          issues.push({ level: "warn", path: here, msg: `Дубль имени среди детей: "${child.name}"` });
        }
        if (child.name) seen.add(child.name);
        walk(child, here, false);
      });
    }
  }

  skillsData.forEach(g => walk(g, "", true));

  Object.keys(roles).forEach(r => {
    if (r === "all") return;
    if (!roleDomains[r]) {
      issues.push({ level: "warn", path: `roleDomains.${r}`, msg: "Роль без домена" });
    }
  });

  return issues;
}

/* Печатает отчёт в консоль и возвращает сводку */
export function reportValidation() {
  const issues = validateSkillsData();
  const errors = issues.filter(i => i.level === "error");
  const warns  = issues.filter(i => i.level === "warn");

  if (issues.length === 0) {
    console.log("%c✓ skillsData: всё валидно", "color:#2f8f2f;font-weight:700");
    return { ok: true, errors, warns };
  }

  console.group(
    `%cВалидация skillsData: ${errors.length} ошибок, ${warns.length} предупреждений`,
    errors.length ? "color:#c0392b;font-weight:700" : "color:#c47f00;font-weight:700"
  );

  if (errors.length) {
    console.group("%cОшибки", "color:#c0392b");
    errors.forEach(i => console.error(`${i.path}: ${i.msg}`));
    console.groupEnd();
  }
  if (warns.length) {
    console.group("%cПредупреждения", "color:#c47f00");
    warns.forEach(i => console.warn(`${i.path}: ${i.msg}`));
    console.groupEnd();
  }
  console.groupEnd();

  return { ok: errors.length === 0, errors, warns };
}