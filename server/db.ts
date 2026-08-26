import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, orders, InsertOrder, businesses, InsertBusiness } from "../drizzle/schema";
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
 * Get all businesses with optional filtering by category
 */
export async function getBusinesses(filters?: { category?: string }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get businesses: database not available");
    return [];
  }

  try {
    const conditions = [];

    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(businesses.category, filters.category as any));
    }

    const query = conditions.length > 0
      ? db.select().from(businesses).where(and(...conditions))
      : db.select().from(businesses);

    const result = await query.orderBy(businesses.name);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get businesses:", error);
    throw error;
  }
}

/**
 * Create a new business
 */
export async function createBusiness(business: InsertBusiness) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create business: database not available");
    return null;
  }

  try {
    const result = await db.insert(businesses).values(business).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create business:", error);
    throw error;
  }
}

/**
 * Update an existing business
 */
export async function updateBusiness(businessId: number, updates: Partial<InsertBusiness>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update business: database not available");
    return null;
  }

  try {
    const result = await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, businessId))
      .returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to update business:", error);
    throw error;
  }
}

/**
 * Delete a business
 */
export async function deleteBusiness(businessId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete business: database not available");
    return null;
  }

  try {
    const result = await db.delete(businesses).where(eq(businesses.id, businessId)).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete business:", error);
    throw error;
  }
}

/**
 * Get all orders with optional filtering. Incluye los datos del negocio (join).
 */
export async function getOrders(filters?: { businessId?: number; category?: string; status?: string }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get orders: database not available");
    return [];
  }

  try {
    const conditions = [];

    if (filters?.businessId) {
      conditions.push(eq(orders.businessId, filters.businessId));
    }

    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(businesses.category, filters.category as any));
    }

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(orders.status, filters.status as any));
    }

    const baseQuery = db
      .select({
        id: orders.id,
        clientName: orders.clientName,
        phone: orders.phone,
        businessId: orders.businessId,
        businessName: businesses.name,
        businessCategory: businesses.category,
        businessWhatsapp: businesses.whatsappNumber,
        details: orders.details,
        deliveryType: orders.deliveryType,
        deliveryAddress: orders.deliveryAddress,
        status: orders.status,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(businesses, eq(orders.businessId, businesses.id));

    const query = conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

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
