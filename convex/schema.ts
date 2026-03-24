import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    date: v.string(), // ISO date string (YYYY-MM-DD)
    time: v.string(), // e.g., "09:00"
    services: v.array(v.string()),
    totalAmount: v.number(),
    depositAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled")
    ),
    paystackReference: v.optional(v.string()),
    durationMinutes: v.optional(v.number()), // Total service duration in minutes
    notes: v.optional(v.string()),
    userId: v.string(), // Clerk user ID
  })
    .index("by_date", ["date"])
    .index("by_status", ["status"])
    .index("by_user", ["userId"]),
});
