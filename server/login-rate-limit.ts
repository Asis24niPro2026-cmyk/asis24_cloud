interface AttemptEntry {
  count: number;
  lockedUntil: number;
}

// En memoria, por IP. Suficiente para un solo proceso (Render free tier).
const attempts = new Map<string, AttemptEntry>();

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000; // 15 minutos de bloqueo tras 5 intentos fallidos

export function isLocked(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  return entry.lockedUntil > Date.now();
}

export function msUntilUnlocked(key: string): number {
  const entry = attempts.get(key);
  if (!entry) return 0;
  return Math.max(0, entry.lockedUntil - Date.now());
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

export function recordSuccess(key: string): void {
  attempts.delete(key);
}

// Limpieza periódica
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.lockedUntil < now && entry.count === 0) attempts.delete(key);
  }
}, 30 * 60 * 1000).unref();
