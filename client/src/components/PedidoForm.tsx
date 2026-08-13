import { useState } from "react";
import { trpc } from "../lib/trpc";

const BUSINESS_OPTIONS = [
  "Comidería",
  "Papelería",
  "Ropa",
  "Celulares",
  "Masajes",
  "Uñas Acrílicas",
  "Variedades",
  "Examen/Laboratorio",
  "Otros",
] as const;

const DELIVERY_OPTIONS = ["Local", "Delivery"] as const;

export default function PedidoForm() {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState<(typeof BUSINESS_OPTIONS)[number]>(BUSINESS_OPTIONS[0]);
  const [details, setDetails] = useState("");
  const [deliveryType, setDeliveryType] = useState<(typeof DELIVERY_OPTIONS)[number]>("Local");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const crearPedido = trpc.orders.create.useMutation({
    onSuccess: () => {
      setClientName("");
      setPhone("");
      setBusiness(BUSINESS_OPTIONS[0]);
      setDetails("");
      setDeliveryType("Local");
      setDeliveryAddress("");
      alert("Pedido creado con éxito ✅");
    },
    onError: (err) => {
      alert("Error al crear el pedido: " + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    crearPedido.mutate({
      clientName,
      phone,
      business,
      details,
      deliveryType,
      deliveryAddress: deliveryType === "Delivery" ? deliveryAddress : "",
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h2>Crear nuevo pedido</h2>

      <div>
        <label>Nombre del cliente:</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Teléfono:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Negocio:</label>
        <select
          value={business}
          onChange={(e) => setBusiness(e.target.value as typeof business)}
          required
        >
          {BUSINESS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Detalles del pedido:</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Tipo de entrega:</label>
        <select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value as typeof deliveryType)}
          required
        >
          {DELIVERY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {deliveryType === "Delivery" && (
        <div>
          <label>Dirección de entrega:</label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit" disabled={crearPedido.isPending}>
        {crearPedido.isPending ? "Enviando..." : "Enviar pedido"}
      </button>
    </form>
  );
}