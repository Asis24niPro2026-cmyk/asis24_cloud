import { useState } from "react";

export default function PedidoForm() {
  const [nombre, setNombre] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const crearPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    const pedido = {
      cliente: nombre,
      producto,
      cantidad,
      estado: "pendiente",
    };

    await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    // Limpia el formulario después de enviar
    setNombre("");
    setProducto("");
    setCantidad(1);
    alert("Pedido creado con éxito ✅");
  };

  return (
    <form onSubmit={crearPedido} style={{ marginTop: "20px" }}>
      <h2>Crear nuevo pedido</h2>

      <div>
        <label>Nombre del cliente:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Producto/Servicio:</label>
        <input
          type="text"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Cantidad:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          min="1"
          required
        />
      </div>

      <button type="submit">Enviar pedido</button>
    </form>
  );
}
