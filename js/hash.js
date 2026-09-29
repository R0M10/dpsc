import { state } from "./state.js";
import { domains, roles } from "./data.js";

export function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  h.split(",").forEach(part => {
    if (part.startsWith("d:")) {
      const d = part.slice(2);
      if (domains[d]) state.activeDomain = d;
    } else if (part && roles[part]) {
      state.activeRoles.add(part);
    }
  });
}

export function writeHash() {
  if (location.protocol === "file:") return;
  const parts = [];
  if (state.activeDomain !== "all") parts.push("d:" + state.activeDomain);
  [...state.activeRoles].sort().forEach(r => parts.push(r));
  const newHash = parts.length ? "#" + parts.join(",") : "";
  if (newHash === location.hash) return;
  try {
    const url = newHash || (location.pathname + location.search);
    history.replaceState(null, "", url);
  } catch (e) {
    console.warn("replaceState failed:", e);
  }
}