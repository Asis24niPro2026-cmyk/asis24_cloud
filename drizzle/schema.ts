import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const businessEnum = pgEnum("business", ["Comidería", "Papelería", "Ropa", "Celulares", "Masajes", "Uñas Acrílicas", "Variedades", "Examen/Laboratorio", "Otros"]);
export const deliveryTypeEnum = pgEnum("deliveryType", ["Local", "Delivery"]);
export const statusEnum = pgEnum("status", ["Pendiente", "Enviado al negocio", "Entregado"]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  business: businessEnum("business").notNull(),
  details: text("details").notNull(),
  deliveryType: deliveryTypeEnum("deliveryType").notNull(),
  deliveryAddress: varchar("deliveryAddress", { length: 500 }),
  status: statusEnum("status").default("Pendiente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  role: pgEnum("admin_role", ["admin"])("role").default("admin").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
