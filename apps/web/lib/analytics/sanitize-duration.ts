const MAX_REASONABLE_DURATION_SECONDS = 24 * 60 * 60;

export function sanitizeDuration(rawTime: unknown): number | null {
  if (rawTime === null || rawTime === undefined) return null;

  const val = Number(rawTime);

  if (isNaN(val) || !isFinite(val) || val < 0) {
    return null;
  }

  let s = val;

  if (s > 10000) {
    const converted = Math.round(s / 1000);
    if (converted > 0 && converted <= MAX_REASONABLE_DURATION_SECONDS) {
      s = converted;
    } else {
      return null;
    }
  }
  if (s > MAX_REASONABLE_DURATION_SECONDS) {
    return null;
  }

  return s;
}
