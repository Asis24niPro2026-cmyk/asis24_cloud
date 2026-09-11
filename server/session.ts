import crypto from "crypto";

interface Session {
  username: string;
  expiresAt: number;
}

// Almacenamiento en memoria: suficiente para un solo proceso (Render free tier).
// Si el servidor se reinicia, los admins deben volver a iniciar sesión (esperado).
const sessions = new Map<string, Session>();

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

export function createSession(username: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

export function validateSession(token: string | undefined | null): boolean {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string | undefined | null): void {
  if (token) sessions.delete(token);
}

// Limpieza periódica de sesiones vencidas para no acumular memoria indefinidamente
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt < now) sessions.delete(token);
  }
}, 30 * 60 * 1000).unref();
