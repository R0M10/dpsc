import { roles, domains, roleDomains, skillTypes, skillsData } from "./data.js";

/* Полный слепок данных проекта */
function buildSnapshot() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    domains,
    roles,
    roleDomains,
    skillTypes,
    skillsData,
  };
}

/* Скачать JSON-файл */
export function exportJSON() {
  const json = JSON.stringify(buildSnapshot(), null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `skills-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Копирование в буфер — пригодится для отладки */
export async function copyJSONToClipboard() {
  const json = JSON.stringify(buildSnapshot(), null, 2);
  try {
    await navigator.clipboard.writeText(json);
    return true;
  } catch (e) {
    console.warn("Clipboard error:", e);
    return false;
  }
}