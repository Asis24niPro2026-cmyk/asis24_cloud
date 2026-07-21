import { useEffect, useState } from "react";
import { getOrders } from "./api";

function App() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Pedidos</h1>
      {error && <p style={{color:"red"}}>{error}</p>}
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.customer} - {o.product} ({o.status})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
