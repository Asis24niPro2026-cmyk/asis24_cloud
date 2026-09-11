import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getOrders, createOrder, updateOrderStatus, deleteOrder, getBusinesses, createBusiness, updateBusiness, deleteBusiness } from './db';
import { authenticateAdmin } from './auth-admin';
import { createSession, validateSession, destroySession } from './session';
import { isLocked, msUntilUnlocked, recordFailedAttempt, recordSuccess } from './login-rate-limit';

interface Context {
  token?: string;
  ip: string;
}

const t = initTRPC.context<Context>().create();

// Middleware: exige un token de sesión válido (emitido en admin.login)
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!validateSession(ctx.token)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sesión inválida o expirada. Vuelve a iniciar sesión.",
    });
  }
  return next();
});

const protectedProcedure = t.procedure.use(isAuthed);

const businessValues = [
  "Comidería", "Papelería", "Ropa", "Celulares", "Masajes",
  "Uñas Acrílicas", "Variedades", "Examen/Laboratorio", "Barbería",
  "Artículos de Segunda", "Otros",
] as const;

const deliveryTypeValues = ["Local", "Delivery"] as const;

const statusValues = ["Pendiente", "Enviado al negocio", "Entregado"] as const;

export const appRouter = t.router({
  admin: t.router({
    login: t.procedure
      .input(
        z.object({
          username: z.string().min(1).max(100),
          password: z.string().min(1).max(200),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const rateLimitKey = ctx.ip;

        if (isLocked(rateLimitKey)) {
          const minutes = Math.ceil(msUntilUnlocked(rateLimitKey) / 60000);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Demasiados intentos fallidos. Intenta de nuevo en ${minutes} minuto(s).`,
          });
        }

        const isValid = await authenticateAdmin(input.username, input.password);
        if (!isValid) {
          recordFailedAttempt(rateLimitKey);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Usuario o contraseña incorrectos",
          });
        }

        recordSuccess(rateLimitKey);
        const token = createSession(input.username);
        return { success: true, token };
      }),

    logout: protectedProcedure.mutation(async ({ ctx }) => {
      destroySession(ctx.token);
      return { success: true };
    }),
  }),

  hello: t.procedure
    .input(z.string().nullish())
    .query(({ input }) => {
      return `Hola ${input ?? 'mundo'} desde tRPC!`;
    }),

  businesses: t.router({
    // Público: el formulario de clientes necesita listar negocios por categoría
    list: t.procedure
      .input(
        z.object({
          category: z.enum(businessValues).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getBusinesses(input);
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(150),
          category: z.enum(businessValues),
          whatsappNumber: z.string().max(30).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createBusiness(input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          businessId: z.number(),
          name: z.string().min(1).max(150).optional(),
          category: z.enum(businessValues).optional(),
          whatsappNumber: z.string().max(30).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { businessId, ...updates } = input;
        return await updateBusiness(businessId, updates);
      }),

    delete: protectedProcedure
      .input(z.object({ businessId: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBusiness(input.businessId);
      }),
  }),

  orders: t.router({
    // Protegido: la lista de pedidos expone datos de clientes (nombre, teléfono, dirección)
    list: protectedProcedure
      .input(
        z.object({
          businessId: z.number().optional(),
          category: z.enum(businessValues).optional(),
          status: z.enum(statusValues).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        return await getOrders(input);
      }),

    // Público: el formulario de clientes crea pedidos sin necesitar login
    create: t.procedure
      .input(
        z.object({
          clientName: z.string().min(1).max(150),
          phone: z.string().min(1).max(30),
          businessId: z.number(),
          details: z.string().min(1).max(1000),
          deliveryType: z.enum(deliveryTypeValues),
          deliveryAddress: z.string().max(300).optional(),
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

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(statusValues),
        })
      )
      .mutation(async ({ input }) => {
        return await updateOrderStatus(input.orderId, input.status);
      }),

    delete: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteOrder(input.orderId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
