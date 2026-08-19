import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getOrders, createOrder, updateOrderStatus, deleteOrder } from './db';
import { authenticateAdmin } from './auth-admin';

const t = initTRPC.create();

const businessValues = [
  "Comidería", "Papelería", "Ropa", "Celulares", "Masajes",
  "Uñas Acrílicas", "Variedades", "Examen/Laboratorio", "Otros",
] as const;

const deliveryTypeValues = ["Local", "Delivery"] as const;

const statusValues = ["Pendiente", "Enviado al negocio", "Entregado"] as const;

export const appRouter = t.router({
  admin: t.router({
    login: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const isValid = await authenticateAdmin(input.username, input.password);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Usuario o contraseña incorrectos",
          });
        }
        return { success: true };
      }),

    logout: t.procedure.mutation(async () => {
      return { success: true };
    }),
  }),

  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input }) => {
      return `Hola ${input ?? 'mundo'} desde tRPC!`;
    }),

  orders: t.router({
    list: t.procedure
      .input(
        z.object({
          business: z.enum(businessValues).optional(),
          status: z.enum(statusValues).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getOrders(input);
      }),

    create: t.procedure
      .input(
        z.object({
          clientName: z.string().min(1),
          phone: z.string().min(1),
          business: z.enum(businessValues),
          details: z.string().min(1),
          deliveryType: z.enum(deliveryTypeValues),
          deliveryAddress: z.string().optional(),
        }).refine(
          (data) =>
            data.deliveryType !== "Delivery" ||
            (data.deliveryAddress && data.deliveryAddress.trim().length > 0),
          {
            message: "La dirección es obligatoria cuando el tipo de entrega es Delivery",
            path: ["deliveryAddress"],
          }
        )
      )
      .mutation(async ({ input }) => {
        return await createOrder(input);
      }),

    updateStatus: t.procedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(statusValues),
        })
      )
      .mutation(async ({ input }) => {
        return await updateOrderStatus(input.orderId, input.status);
      }),

    delete: t.procedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteOrder(input.orderId);
      }),
  }),
});

export type AppRouter = typeof appRouter;