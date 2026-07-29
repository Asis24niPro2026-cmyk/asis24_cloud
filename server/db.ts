import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, orders, InsertOrder } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle(sql);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // 👇 en Postgres/Neon se usa onConflictDoUpdate en vez de onDuplicateKeyUpdate
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all orders with optional filtering
 */
export async function getOrders(filters?: { business?: string; status?: string }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get orders: database not available");
    return [];
  }

  try {
    const conditions = [];

    if (filters?.business && filters.business !== "all") {
      conditions.push(eq(orders.business, filters.business as any));
    }

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(orders.status, filters.status as any));
    }

    const query = conditions.length > 0
      ? db.select().from(orders).where(and(...conditions))
      : db.select().from(orders);

    const result = await query.orderBy(desc(orders.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get orders:", error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return null;
  }

  try {
    const result = await db.insert(orders).values(order).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return null;
  }

  try {
    const result = await db
      .update(orders)
      .set({ status: status as any })
      .where(eq(orders.id, orderId))
      .returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to update order:", error);
    throw error;
  }
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete order: database not available");
    return null;
  }

  try {
    const result = await db.delete(orders).where(eq(orders.id, orderId)).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete order:", error);
    throw error;
  }
}
