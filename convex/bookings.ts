import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new pending booking
export const createBooking = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    date: v.string(),
    time: v.string(),
    services: v.array(v.string()),
    totalAmount: v.number(),
    depositAmount: v.number(),
    notes: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const bookingId = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
    });
    return bookingId;
  },
});

// Confirm a booking after Paystack payment
export const confirmBooking = mutation({
  args: {
    id: v.id("bookings"),
    paystackReference: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "paid",
      paystackReference: args.paystackReference,
    });
  },
});

// Get booked slots for a specific date
export const getBookedSlots = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    
    // Include paid bookings OR pending bookings created in the last 15 mins
    const activeBookings = bookings.filter((b) => 
      b.status === "paid" || 
      (b.status === "pending" && b._creationTime > fifteenMinutesAgo)
    );
    
    return activeBookings.map((b) => b.time);
  },
});

// Get days that are fully booked
export const getFullyBookedDays = query({
  handler: async (ctx) => {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    // We can iterate over all recent bookings, but for scale, 
    // we'll just check all paid + recent pending
    const bookings = await ctx.db
      .query("bookings")
      .collect();

    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      const isActive = b.status === "paid" || (b.status === "pending" && b._creationTime > fifteenMinutesAgo);
      if (isActive) {
        counts[b.date] = (counts[b.date] || 0) + 1;
      }
    });

    const maxSlots = 7; 
    return Object.keys(counts).filter((date) => counts[date] >= maxSlots);
  },
});

// Cancel a booking
export const cancelBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
    });
  },
});
