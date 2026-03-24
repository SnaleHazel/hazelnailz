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
    durationMinutes: v.optional(v.number()),
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

// Get booked slots for a specific date — returns time + duration for overlap calc
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
    
    // Return time + durationMinutes so the frontend can compute overlapping slots
    return activeBookings.map((b) => ({
      time: b.time,
      durationMinutes: b.durationMinutes ?? 60, // default 1h for legacy bookings
    }));
  },
});

// Get days that are fully booked
export const getFullyBookedDays = query({
  handler: async (ctx) => {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    const bookings = await ctx.db
      .query("bookings")
      .collect();

    // Group bookings by date and calculate total 30-min slots consumed
    const slotsPerDay: Record<string, number> = {};
    bookings.forEach((b) => {
      const isActive = b.status === "paid" || (b.status === "pending" && b._creationTime > fifteenMinutesAgo);
      if (isActive) {
        const durationSlots = Math.ceil((b.durationMinutes ?? 60) / 30);
        slotsPerDay[b.date] = (slotsPerDay[b.date] || 0) + durationSlots;
      }
    });

    // 18 half-hour slots (7am through 3:30pm)
    const maxSlots = 18;
    return Object.keys(slotsPerDay).filter((date) => slotsPerDay[date] >= maxSlots);
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

// Get all bookings for a specific user
export const getUserBookings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

