import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();

// ✅ Configuración CORS
const corsOptions = {
  origin: "https://asis24-client.onrender.com", // dominio del frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // incluye OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 👈 Manejo explícito de preflight

app.use(express.json());

// Ruta raíz
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

// Rutas de pedidos
app.get("/api/orders", async (req, res) => {
  res.json([]);
});

app.post("/api/orders", async (req, res) => {
  const { customer, product, status } = req.body;
  res.json({ id: Date.now(), customer, product, status });
});

// 🚀 Inicializar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
