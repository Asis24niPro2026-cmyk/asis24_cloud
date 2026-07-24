import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();

// 🔧 Configuración CORS
app.use(cors({
  origin: "https://asis24-client.onrender.com", // dominio del frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"], // 👈 añade esto
  credentials: true
}));

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

// GET /api/orders
app.get("/api/orders", async (req, res) => {
  res.json([]);
});

// POST /api/orders
app.post("/api/orders", async (req, res) => {
  const { customer, product, status } = req.body;
  res.json({ id: Date.now(), customer, product, status });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
