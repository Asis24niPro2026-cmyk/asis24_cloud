// Token de sesión del admin, guardado en memoria (no localStorage, para no
// persistir la sesión más allá del tiempo que la pestaña está abierta).
let token: string | null = null;

export function setAuthToken(newToken: string | null) {
  token = newToken;
}

export function getAuthToken(): string | null {
  return token;
}
