/** Relative time label e.g. "12 min ago", "Yesterday" */
export function formatTimeAgo(timestampMs: number, nowMs: number = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((nowMs - timestampMs) / 1000));

  if (diffSec < 60) return "Just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return diffMin === 1 ? "1 min ago" : `${diffMin} min ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
  }

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return diffWeek === 1 ? "1 week ago" : `${diffWeek} weeks ago`;
  }

  const date = new Date(timestampMs);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
