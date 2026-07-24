import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();

// 🔧 Configuración CORS
app.use(cors({
  origin: "https://asis24-client.onrender.com", // dominio del frontend en Render
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // cabeceras permitidas
  credentials: true
}));

app.use(express.json());

// Ruta raíz para verificar que el servidor está vivo
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas de tRPC
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

// ✅ Rutas de pedidos
app.get("/api/orders", async (req, res) => {
  // Ejemplo simple: devolver un array vacío
  res.json([]);
});

app.post("/api/orders", async (req, res) => {
  const { customer, product, status } = req.body;
  // Ejemplo simple: devolver el objeto recibido con un id simulado
  res.json({ id: Date.now(), customer, product, status });
});

// 🚀 Inicializar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
