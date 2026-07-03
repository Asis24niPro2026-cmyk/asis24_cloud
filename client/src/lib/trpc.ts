import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers"; // ajusta la ruta si tu backend está en otra carpeta

export const trpc = createTRPCReact<AppRouter>();
