export const formatTotalDuration = (hours) => {
  if (!Number.isFinite(hours)) return null;
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
export const parsePrice = (price) => Number.parseFloat(price.replace("$", ""));
export const formatRelativeTime = (iso, now = Date.now()) => {
  if (!iso) return null;
  const diffMs = Math.max(0, now - new Date(iso).getTime());
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
};
const compactNumberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactNumber = (value) => {
  if (!Number.isFinite(value)) return null;
  return compactNumberFormat.format(value).toLowerCase();
};
export const formatDueLabel = (iso, now = Date.now()) => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const diffDays = Math.ceil((new Date(iso).getTime() - now) / DAY_MS);
  if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)}d`, overdue: true };
  if (diffDays === 0) return { text: "Due today", overdue: true };
  if (diffDays === 1) return { text: "Due tomorrow", overdue: false };
  return { text: `Due in ${diffDays} days`, overdue: false };
};

export const courseImageUrl = (url, width) => {
  if (!url || !url.includes("images.unsplash.com")) return url;
  const w = Math.max(100, Math.round(width));
  if (url.includes("w=")) return url.replace(/([?&])w=\d+/, `$1w=${w}`);
  return `${url}${url.includes("?") ? "&" : "?"}w=${w}`;
};
