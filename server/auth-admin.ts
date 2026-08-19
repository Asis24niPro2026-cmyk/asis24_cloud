import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { adminUsers } from "../drizzle/schema";

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const result = await bcryptjs.compare(password, hash);
    console.log(`[Auth] Password verification: ${result ? "SUCCESS" : "FAILED"}`);
    return result;
  } catch (error) {
    console.error("[Auth] Error during password verification:", error);
    return false;
  }
}

/**
 * Authenticate admin user
 */
export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Auth] Cannot authenticate: database not available");
    return false;
  }

  try {
    console.log(`[Auth] Attempting to authenticate user: ${username}`);
    
    const result = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    console.log(`[Auth] Query result: ${result.length} user(s) found`);

    if (result.length === 0) {
      console.warn(`[Auth] User not found: ${username}`);
      return false;
    }

    const admin = result[0];
    console.log(`[Auth] User found. Verifying password...`);
    console.log(`[Auth] Stored hash length: ${admin.passwordHash.length}`);
    
    const isValid = await verifyPassword(password, admin.passwordHash);
    console.log(`[Auth] Authentication result: ${isValid ? "SUCCESS" : "FAILED"}`);
    
    return isValid;
  } catch (error) {
    console.error("[Auth] Failed to authenticate admin:", error);
    return false;
  }
}

/**
 * Create or update admin user with hashed password
 */
export async function setAdminCredentials(username: string, password: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Auth] Cannot set credentials: database not available");
    throw new Error("Database not available (check DATABASE_URL)");
  }

  try {
    const passwordHash = await hashPassword(password);
    console.log(`[Auth] Generated hash for user ${username}: ${passwordHash}`);

    // Check if admin exists
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (existing.length > 0) {
      // Update existing admin
      await db
        .update(adminUsers)
        .set({ passwordHash })
        .where(eq(adminUsers.username, username));
      console.log(`[Auth] Updated admin credentials for user: ${username}`);
    } else {
      // Create new admin
      await db.insert(adminUsers).values({
        username,
        passwordHash,
        role: "admin",
      });
      console.log(`[Auth] Created new admin user: ${username}`);
    }
  } catch (error) {
    console.error("[Auth] Failed to set admin credentials:", error);
    throw error;
  }
}
