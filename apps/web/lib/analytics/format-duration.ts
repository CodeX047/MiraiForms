export function formatDuration(seconds: number): string {
  if (seconds < 0) return "0s";

  const s = Math.round(seconds);

  if (s < 60) {
    return `${s}s`;
  }

  const mins = Math.floor(s / 60);
  const remainingSecs = s % 60;

  if (mins < 60) {
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
  }

  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
}
