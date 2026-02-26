// Rate limiter with pluggable store (default: in-memory, swap to Redis for multi-instance)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | undefined>;
  set(key: string, entry: RateLimitEntry): Promise<void>;
  delete(key: string): Promise<void>;
  entries(): AsyncIterable<[string, RateLimitEntry]>;
}

// Default in-memory store
class MemoryStore implements RateLimitStore {
  private store = new Map<string, RateLimitEntry>();

  async get(key: string) {
    return this.store.get(key);
  }
  async set(key: string, entry: RateLimitEntry) {
    this.store.set(key, entry);
  }
  async delete(key: string) {
    this.store.delete(key);
  }
  async *entries(): AsyncIterable<[string, RateLimitEntry]> {
    yield* this.store.entries();
  }
}

const defaultStore = new MemoryStore();
let activeStore: RateLimitStore = defaultStore;

/** Swap the rate limit backing store (e.g. to Redis for multi-instance deployments) */
export function setRateLimitStore(store: RateLimitStore) {
  activeStore = store;
}

// Clean up expired entries every 5 minutes
setInterval(async () => {
  const now = Date.now();
  for await (const [key, entry] of activeStore.entries()) {
    if (entry.resetAt < now) {
      await activeStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60 * 60 * 1000 }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const entry = await activeStore.get(identifier);

  // No entry or expired - create new
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowMs;
    await activeStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Entry exists and not expired
  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment count
  entry.count++;
  await activeStore.set(identifier, entry);
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getRateLimitIdentifier(req: any): string {
  // Handle test environment where req might be undefined or missing headers
  if (!req || !req.headers) {
    return 'test-ip-' + Math.random().toString(36).substring(7);
  }

  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers?.['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  // Fallback to direct connection IP
  return req.socket?.remoteAddress || 'unknown';
}
