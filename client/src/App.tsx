import { useEffect, useState } from "react";
import { getOrders, createOrder } from "./api";

function App() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar pedidos al inicio
  useEffect(() => {
    getOrders()
      .then(data => setOrders(data))
      .catch(err => setError(err.message));
  }, []);

  // Función para crear un pedido de prueba
  const handleCreateOrder = async () => {
    try {
      const newOrder = {
        customer: "Evelio",
        product: "Chatbot MVP",
        status: "pendiente",
      };
      const savedOrder = await createOrder(newOrder);
      setOrders(prev => [...prev, savedOrder]); // Agregarlo a la lista
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Pedidos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleCreateOrder}>Crear pedido de prueba</button>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            {o.customer} - {o.product} ({o.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

