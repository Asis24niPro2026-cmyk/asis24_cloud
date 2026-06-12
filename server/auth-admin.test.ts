import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./auth-admin";

describe("auth-admin", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should generate different hashes for the same password", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("should verify a correct password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("wrongPassword", hash);

      expect(isValid).toBe(false);
    });

    it("should be case-sensitive", async () => {
      const password = "TestPassword123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("testpassword123", hash);

      expect(isValid).toBe(false);
    });
  });
});
