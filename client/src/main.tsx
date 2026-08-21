import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import App from "./App";
import { trpc } from "./lib/trpc";

// Importa el tipo de tu router del backend
import type { AppRouter } from "../server/router";

// Configura React Query
const queryClient = new QueryClient();

// Configura el cliente tRPC (para el hook trpc.Provider)
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || "https://asis24-cloud-1.onrender.com"}/api/trpc`, // ajusta la URL si tu backend expone otra ruta
    }),
  ],
});

// Renderiza la aplicación
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);