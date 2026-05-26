import { sanitizeDuration } from "./sanitize-duration";

export interface AnalyticsMetrics {
  totalCount: number;
  validCount: number;
  average: number | null;
  min: number | null;
  max: number | null;
  median: number | null;
}

export function calculateMetrics(
  submissions: Array<{ metadata?: { completionTime?: number } | null }> | null | undefined
): AnalyticsMetrics {
  const result: AnalyticsMetrics = {
    totalCount: submissions?.length || 0,
    validCount: 0,
    average: null,
    min: null,
    max: null,
    median: null,
  };

  if (!submissions || submissions.length === 0) {
    return result;
  }

  // Extract and sanitize completion times
  const validTimes: number[] = [];
  for (const s of submissions) {
    const rawTime = s.metadata?.completionTime;
    const sanitized = sanitizeDuration(rawTime);
    if (sanitized !== null) {
      validTimes.push(sanitized);
    }
  }

  result.validCount = validTimes.length;

  if (validTimes.length === 0) {
    return result;
  }

  // Sort ascending for min, max, and median calculations
  validTimes.sort((a, b) => a - b);

  // Min & Max
  result.min = validTimes[0]!;
  result.max = validTimes[validTimes.length - 1]!;

  // Average
  const sum = validTimes.reduce((acc, curr) => acc + curr, 0);
  result.average = Math.round(sum / validTimes.length);

  // Median
  const mid = Math.floor(validTimes.length / 2);
  if (validTimes.length % 2 === 0) {
    result.median = Math.round((validTimes[mid - 1]! + validTimes[mid]!) / 2);
  } else {
    result.median = validTimes[mid]!;
  }

  return result;
}
