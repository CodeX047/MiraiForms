import { TRPCError } from "@trpc/server";

export class InMemoryRateLimiter {
  private store = new Map<string, number[]>();

  constructor(
    private limit: number, // max requests
    private windowMs: number // time window in milliseconds
  ) {}

  public check(key: string) {
    const now = Date.now();
    const timestamps = this.store.get(key) || [];
    
    // Filter timestamps to only keep ones within the current window
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);
    
    if (validTimestamps.length >= this.limit) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please wait a moment before trying again.",
      });
    }
    
    validTimestamps.push(now);
    this.store.set(key, validTimestamps);
  }
}

// 5 submissions per 60 seconds per IP address
export const submissionRateLimiter = new InMemoryRateLimiter(5, 60 * 1000);
