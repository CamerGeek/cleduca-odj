import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

const buckets = new Map<string, { count: number; resetAt: number }>();

export async function getClientIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    store.get("x-real-ip") ||
    "unknown"
  );
}

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET || "local"}`)
    .digest("hex")
    .slice(0, 24);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }
  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function safeCompare(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
