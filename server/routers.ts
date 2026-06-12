import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "./db";
import { notifyOwner } from "./_core/notification";
import { authenticateAdmin } from "./auth-admin";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const isValid = await authenticateAdmin(input.username, input.password);

        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }

        // Set admin session in cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("admin_session", input.username, {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return { success: true, username: input.username };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("admin_session", { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  orders: router({
    list: publicProcedure
      .input(z.object({ business: z.string().optional(), status: z.string().optional() }))
      .query(async ({ input }) => {
        return getOrders({ business: input.business, status: input.status });
      }),

    create: publicProcedure
      .input(z.object({
        clientName: z.string().min(1, "El nombre del cliente es requerido"),
        phone: z.string().min(1, "El teléfono es requerido"),
        business: z.enum(["Comidería", "Papelería", "Ropa", "Celulares", "Masajes", "Uñas Acrílicas", "Variedades", "Examen/Laboratorio", "Otros"]),
        details: z.string().min(1, "Los detalles del pedido son requeridos"),
        deliveryType: z.enum(["Local", "Delivery"]),
        deliveryAddress: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createOrder({
          clientName: input.clientName,
          phone: input.phone,
          business: input.business,
          details: input.details,
          deliveryType: input.deliveryType,
          deliveryAddress: input.deliveryAddress || "",
          status: "Pendiente",
        });

        // Notify owner about new order
        try {
          const deliveryInfo = input.deliveryType === "Delivery" ? `Dirección: ${input.deliveryAddress}` : "Tipo: Local";
          await notifyOwner({
            title: "Nuevo Pedido Recibido en ASIS24",
            content: `Nuevo pedido de ${input.clientName} (${input.business}): ${input.details}. Teléfono: ${input.phone}. ${deliveryInfo}`,
          });
        } catch (error) {
          console.error("Failed to send notification:", error);
        }

        return result;
      }),

    updateStatus: publicProcedure
      .input(z.object({ orderId: z.number(), status: z.string() }))
      .mutation(async ({ input }) => {
        return updateOrderStatus(input.orderId, input.status);
      }),

    delete: publicProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        return deleteOrder(input.orderId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
