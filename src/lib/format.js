/**
 * Format a numeric hour count into a compact duration label.
 * 12 -> "12h", 0.75 -> "45m", 2.5 -> "2h 30m".
 */
export const formatTotalDuration = (hours) => {
  if (!Number.isFinite(hours)) return null;
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Parse a `$`-prefixed price string (Course.price / Course.originalPrice)
 * into a number. "$10.99" -> 10.99.
 */
export const parsePrice = (price) => Number.parseFloat(price.replace("$", ""));

/**
 * Format a number into a compact, human-friendly label using a shared
 * Intl.NumberFormat instance. 1240 -> "1.2k", 5400 -> "5.4k", 760 -> "760".
 * Uppercase "K"/"M" suffixes are lowercased so students reads "98k students".
 */
const compactNumberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatCompactNumber = (value) => {
  if (!Number.isFinite(value)) return null;
  return compactNumberFormat.format(value).toLowerCase();
};
