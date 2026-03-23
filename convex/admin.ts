import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Server-side admin access control via Clerk JWT
const ADMIN_EMAILS = ["lgumbi2169@gmail.com"];

const checkAdmin = async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Unauthenticated. Please sign in.");
    }

    const email = identity.email || "";
    const isAdmin =
        ADMIN_EMAILS.includes(email) ||
        email.includes("Luazii");

    if (!isAdmin) {
        throw new Error("Unauthorized. Admin access only.");
    }

    return identity;
};

export const getDashboardStats = query({
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const bookings = await ctx.db.query("bookings").collect();

        const totalBookings = bookings.length;
        const paidBookings = bookings.filter(b => b.status === "paid");
        const totalRevenue = paidBookings.reduce((sum, b) => sum + b.depositAmount, 0);

        // Group by month for trend
        const revenueByMonth: Record<string, number> = {};
        paidBookings.forEach(b => {
            const date = new Date(b.date);
            const month = date.toLocaleString('default', { month: 'short' });
            revenueByMonth[month] = (revenueByMonth[month] || 0) + b.depositAmount;
        });

        // Most popular services
        const serviceCounts: Record<string, number> = {};
        bookings.forEach(b => {
            b.services.forEach(s => {
                serviceCounts[s] = (serviceCounts[s] || 0) + 1;
            });
        });

        const topServices = Object.entries(serviceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        return {
            totalBookings,
            activeAppointments: bookings.filter(b => b.status === "paid").length,
            totalRevenue,
            revenueByMonth,
            topServices
        };
    },
});

export const listAllBookings = query({
    args: {
        status: v.optional(v.string()),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        const bookings = await (args.status
            ? ctx.db.query("bookings").withIndex("by_status", (q) => q.eq("status", args.status as any))
            : ctx.db.query("bookings")
        ).order("desc").take(args.limit || 100);

        return bookings;
    },
});

export const listClients = query({
    handler: async (ctx) => {
        await checkAdmin(ctx);
        const bookings = await ctx.db.query("bookings").collect();

        // Group by email to identify unique clients
        const clientMap: Record<string, any> = {};

        bookings.forEach(b => {
            if (!clientMap[b.email]) {
                clientMap[b.email] = {
                    name: b.name,
                    email: b.email,
                    phone: b.phone,
                    totalBookings: 0,
                    totalSpent: 0,
                    lastBooking: b.date,
                    userId: b.userId
                };
            }

            clientMap[b.email].totalBookings += 1;
            if (b.status === "paid") {
                clientMap[b.email].totalSpent += b.depositAmount;
            }

            if (new Date(b.date) > new Date(clientMap[b.email].lastBooking)) {
                clientMap[b.email].lastBooking = b.date;
            }
        });

        return Object.values(clientMap).sort((a, b) => b.totalSpent - a.totalSpent);
    },
});

export const updateBookingStatus = mutation({
    args: {
        id: v.id("bookings"),
        status: v.union(v.literal("paid"), v.literal("cancelled"), v.literal("pending"))
    },
    handler: async (ctx, args) => {
        await checkAdmin(ctx);
        await ctx.db.patch(args.id, { status: args.status });
    },
});
