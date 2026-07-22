import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();

// ✅ Configuración de CORS específica para tu frontend en Render
app.use(cors({
  origin: "https://asis24-client.onrender.com", // dominio del frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
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

// Nueva ruta GET /api/orders
app.get("/api/orders", async (req, res) => {
  // Aquí deberías conectar con Neon
  // Ejemplo simple: devolver un array vacío
  res.json([]);
});

// Nueva ruta POST /api/orders
app.post("/api/orders", async (req, res) => {
  const { customer, product, status } = req.body;
  // Aquí deberías insertar en Neon
  // Ejemplo simple: devolver el objeto recibido con un id simulado
  res.json({ id: Date.now(), customer, product, status });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
