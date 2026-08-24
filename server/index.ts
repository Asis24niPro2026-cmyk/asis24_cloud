import "dotenv/config";
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();

// ✅ Configuración CORS
const allowedOrigins = [
  "https://asis24-client.onrender.com",
  process.env.CORS_ORIGIN, // dominio local (Codespaces) para desarrollo
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions)); // Manejo explícito de preflight

// 🔧 Middleware manual para asegurar cabeceras CORS en todas las respuestas
app.use((req, res, next) => {
   const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // responde OK al preflight
  }
  next();
});

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
// 🚀 Inicializar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});