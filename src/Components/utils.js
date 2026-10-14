export const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

export const timeAgo = (t) => {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export const money = (r) => (r && r[0] ? `$${r[0].toLocaleString()} – $${r[1].toLocaleString()}` : "Not disclosed");

export const isNew = (t) => Date.now() - t < 2 * 24 * 60 * 60 * 1000;

export const modeTone = { Remote: "green", Onsite: "blue", Hybrid: "violet" };

export const palette = ["#1f7a3a", "#3b5bdb", "#d9480f", "#0c8599", "#7048e8", "#c2255c", "#e67700", "#2b8a3e"];
export const colorFor = (str = "") => palette[[...str].reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length];

export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
