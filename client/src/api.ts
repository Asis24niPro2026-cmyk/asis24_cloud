// client/src/api.ts

// Usa la variable de entorno o un valor por defecto
const API_URL = import.meta.env.VITE_API_URL || "https://asis24-cloud-1.onrender.com";

// Ejemplo: obtener pedidos
export async function getOrders() {
  const response = await fetch(`${API_URL}/api/orders`);
  if (!response.ok) throw new Error("Error al obtener pedidos");
  return response.json();
}

// Ejemplo: crear pedido
export async function createOrder(order: any) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error("Error al crear pedido");
  return response.json();
}
