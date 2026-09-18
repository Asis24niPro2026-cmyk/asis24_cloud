interface WindowEntry {
  count: number;
  windowStart: number;
}

/**
 * Rate limiter genérico "N acciones por ventana de tiempo", en memoria, por clave (normalmente IP).
 * Suficiente para un solo proceso (Render free tier). A diferencia de login-rate-limit.ts
 * (que bloquea tras fallos), este limita la CANTIDAD de acciones exitosas en una ventana,
 * pensado para endpoints públicos como orders.create.
 */
export function createRateLimiter(maxActions: number, windowMs: number) {
  const hits = new Map<string, WindowEntry>();

  function isRateLimited(key: string): boolean {
    const entry = hits.get(key);
    if (!entry) return false;
    const now = Date.now();
    if (now - entry.windowStart > windowMs) {
      // La ventana expiró, ya no está limitado
      return false;
    }
    return entry.count >= maxActions;
  }

  function msUntilReset(key: string): number {
    const entry = hits.get(key);
    if (!entry) return 0;
    const elapsed = Date.now() - entry.windowStart;
    return Math.max(0, windowMs - elapsed);
  }

  function recordAction(key: string): void {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      hits.set(key, { count: 1, windowStart: now });
    } else {
      entry.count += 1;
    }
  }

  // Limpieza periódica de entradas viejas
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (now - entry.windowStart > windowMs) hits.delete(key);
    }
  }, 30 * 60 * 1000).unref();

  return { isRateLimited, msUntilReset, recordAction };
}
