import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("orders router", () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  describe("orders.create", () => {
    it("should create a new order successfully", async () => {
      const result = await caller.orders.create({
        clientName: "Juan Pérez",
        phone: "50312345678",
        business: "Comidería",
        details: "2 pizzas grandes y 1 refresco",
        address: "Calle Principal 123",
      });

      expect(result).toBeDefined();
    });

    it("should reject invalid business type", async () => {
      try {
        await caller.orders.create({
          clientName: "Test",
          phone: "50312345678",
          business: "InvalidBusiness" as any,
          details: "Test order",
          address: "Test address",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject empty client name", async () => {
      try {
        await caller.orders.create({
          clientName: "",
          phone: "50312345678",
          business: "Papelería",
          details: "Test order",
          address: "Test address",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("orders.list", () => {
    it("should list all orders", async () => {
      const result = await caller.orders.list({});
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter orders by business", async () => {
      const result = await caller.orders.list({
        business: "Comidería",
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter orders by status", async () => {
      const result = await caller.orders.list({
        status: "Pendiente",
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
