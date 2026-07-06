import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import App from "./App";

// Importa el tipo de tu router del backend
import type { AppRouter } from "../server/router"; 

// Configura el cliente tRPC
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://asis24-cloud-1.onrender.com/trpc", // ajusta la URL si tu backend expone otra ruta
    }),
  ],
});

// Configura React Query
const queryClient = new QueryClient();

// Renderiza la aplicación
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App trpcClient={trpcClient} />
    </QueryClientProvider>
  </React.StrictMode>
);
