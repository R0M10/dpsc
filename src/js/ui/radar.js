import { state } from "../state.js";
import { ratingToStars } from "../logic.js";
import { domains } from "../data.js";

/* ========== Рисование ========== */

function drawRadarOn(canvas, items) {
  if (!canvas) return;
  const n = items.length;

  const dpr  = window.devicePixelRatio || 1;
  const size = canvas.clientWidth;

  if (n < 3 || !size) {
    if (canvas.getContext) canvas.width = canvas.height = 0;
    canvas._radar = null;
    return;
  }

  const ctx = canvas.getContext("2d");
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const pad = 28;
  const R = size / 2 - pad;

  const angleFor = i => (Math.PI * 2 * i / n) - Math.PI / 2;

  ctx.strokeStyle = "#e6e8eb";
  ctx.lineWidth = 1;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const r = R * (lvl / 5);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = angleFor(i);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
  }
  ctx.stroke();

  const values = items.map(it => it.eval.visible ? it.eval.rating / 10 : 0);

  ctx.beginPath();
  values.forEach((v, i) => {
    const a = angleFor(i);
    const r = R * v;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();

  ctx.fillStyle   = "rgba(47, 107, 255, .22)";
  ctx.fill();
  ctx.strokeStyle = "#2f6bff";
  ctx.lineWidth   = 2;
  ctx.stroke();

  values.forEach((v, i) => {
    const a = angleFor(i);
    const r = R * v;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#2f6bff";
    ctx.fill();
  });

  ctx.fillStyle    = "#555";
  ctx.font         = "600 10px system-ui, sans-serif";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  items.forEach((it, i) => {
    const a = angleFor(i);
    const lx = cx + Math.cos(a) * (R + 14);
    const ly = cy + Math.sin(a) * (R + 14);
    const label = it.group.short || it.group.name.slice(0, 8);
    ctx.fillText(label, lx, ly);
  });

  const visible = items.filter(it => it.eval.visible);
  if (visible.length > 0) {
    const total = visible.reduce((s, it) => s + it.eval.rating, 0) / visible.length;

    ctx.beginPath();
    ctx.arc(cx, cy, 17, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, .85)";
    ctx.fill();

    ctx.fillStyle    = "#2f6bff";
    ctx.font         = "700 15px system-ui, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total.toFixed(1), cx, cy);
  }

  canvas._radar = { cx, cy, R, n, angleFor, items };
}

/* ========== Публичный рендер ========== */

export function renderRadars(groups, evals) {
  const inner = document.getElementById("radar-panel-inner");
  if (!inner) return;

  inner.innerHTML = "";

  const byDomain = new Map();
  groups.forEach((g, i) => {
    const d = g.domain || "other";
    if (!byDomain.has(d)) byDomain.set(d, []);
    byDomain.get(d).push({ group: g, eval: evals[i] });
  });

  const multipleDomains = byDomain.size > 1;
  const toRender = [];

  byDomain.forEach((pairs, domainKey) => {
    const domainBlock = document.createElement("div");
    domainBlock.className = "radar-domain";

    if (multipleDomains) {
      const title = document.createElement("h4");
      title.className = "radar-domain__title";
      title.textContent = domains[domainKey] || domainKey;
      domainBlock.appendChild(title);
    }

    const hard = pairs.filter(p => p.group.category === "hard");
    const soft = pairs.filter(p => p.group.category === "soft");

    [
      ["Hard skills", hard],
      ["Soft skills", soft],
    ].forEach(([label, arr]) => {
      if (arr.length < 3) return;

      const block = document.createElement("div");
      block.className = "radar-block";

      const h3 = document.createElement("h3");
      h3.textContent = label;
      block.appendChild(h3);

      const wrap = document.createElement("div");
      wrap.className = "radar-canvas-wrap";

      const canvas = document.createElement("canvas");
      wrap.appendChild(canvas);
      block.appendChild(wrap);

      domainBlock.appendChild(block);
      toRender.push({ canvas, items: arr });
    });

    if (domainBlock.children.length > 0) {
      inner.appendChild(domainBlock);
    }
  });

  if (toRender.length === 0) {
    const empty = document.createElement("p");
    empty.className = "radar-empty";
    empty.textContent = "Недостаточно данных для диаграммы";
    inner.appendChild(empty);
    inner.classList.remove("radar-panel__inner--scroll");
    return;
  }

  requestAnimationFrame(() => {
    toRender.forEach(({ canvas, items }) => {
      drawRadarOn(canvas, items);
      attachRadarTooltips(canvas);
    });
  });

  inner.classList.toggle("radar-panel__inner--scroll", multipleDomains);
}

/* ========== Тултип ========== */

function findNearestAxis(radar, mx, my) {
  const { cx, cy, n, angleFor, items, R } = radar;

  const dx = mx - cx;
  const dy = my - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > R + 4) return null;

  const angle = Math.atan2(dy, dx);
  let best = 0, bestDiff = Infinity;

  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    let diff = angle - a;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const absDiff = Math.abs(diff);
    if (absDiff < bestDiff) { bestDiff = absDiff; best = i; }
  }

  if (bestDiff > Math.PI / n) return null;
  return { index: best, item: items[best] };
}

function attachRadarTooltips(canvas) {
  if (!canvas || canvas._tooltipsAttached) return;
  canvas._tooltipsAttached = true;

  const tip = () => document.getElementById("radar-tooltip");

  canvas.addEventListener("mousemove", (e) => {
    const el = tip();
    if (!el) return;

    const radar = canvas._radar;
    if (!radar) { el.hidden = true; return; }

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (mx < 0 || my < 0 || mx > rect.width || my > rect.height) {
      el.hidden = true;
      return;
    }

    const found = findNearestAxis(radar, mx, my);
    if (!found) { el.hidden = true; return; }

    const { item } = found;
    const rating10    = item.eval.visible ? item.eval.rating : 0;
    const ratingStars = ratingToStars(rating10);
    const typeLabel   = item.eval._typeDef?.label ?? "";

    el.innerHTML = `
      <span class="radar-tooltip__name">${item.group.name}</span>
      ${typeLabel ? `<span class="radar-tooltip__type">${typeLabel}</span>` : ""}
      <span class="radar-tooltip__rating">
        <span class="radar-tooltip__num">${rating10.toFixed(1)}</span>
        <span class="radar-tooltip__stars">
          <span class="stars" style="--rating: ${ratingStars}"></span>
        </span>
      </span>
    `;
    el.hidden = false;

    const pad = 14;
    const tw  = el.offsetWidth;
    const th  = el.offsetHeight;
    let left = e.clientX + pad;
    let top  = e.clientY + pad;
    if (left + tw > window.innerWidth - 8)  left = e.clientX - tw - pad;
    if (top  + th > window.innerHeight - 8) top  = e.clientY - th - pad;

    el.style.left = left + "px";
    el.style.top  = top  + "px";
  });

  canvas.addEventListener("mouseleave", () => {
    const el = tip();
    if (el) el.hidden = true;
  });
}

/* Глобальный сторож — навешивается один раз */
export function attachGlobalTooltipGuard() {
  document.addEventListener("mousemove", (e) => {
    const el = document.getElementById("radar-tooltip");
    if (!el || el.hidden) return;

    const canvases = document.querySelectorAll(".radar-panel canvas");
    const inside = [...canvases].some(c => {
      const r = c.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right &&
             e.clientY >= r.top  && e.clientY <= r.bottom;
    });

    if (!inside) el.hidden = true;
  });

  window.addEventListener("scroll", () => {
    const el = document.getElementById("radar-tooltip");
    if (el) el.hidden = true;
  }, { passive: true });

  window.addEventListener("blur", () => {
    const el = document.getElementById("radar-tooltip");
    if (el) el.hidden = true;
  });
}