"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
    TrendingUp, 
    Calendar, 
    DollarSign, 
    ArrowUpRight, 
    Clock, 
    Gem,
    Users
} from "lucide-react";
import { motion } from "framer-motion";

import { useUser } from "@clerk/nextjs";
import { isUserAdmin } from "@/lib/admin";

export default function AdminDashboard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const isAdmin = isUserAdmin(user);
    
    const stats = useQuery(api.admin.getDashboardStats, !isAdmin ? "skip" : {});
    const recentBookings = useQuery(api.admin.listAllBookings, !isAdmin ? "skip" : { limit: 5 });

    if (!isLoaded || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 rounded-full border-2 border-[#DFC6C8] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-[#130E0E]">Overview</h1>
                <p className="text-[#B6AFAE] mt-2">Studio performance and active trends</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: `R${stats.totalRevenue}`, icon: DollarSign, color: "gradient-rose", change: "+12.5%" },
                    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "glass", change: "+8%" },
                    { label: "Active Clients", value: "24", icon: Users, color: "glass", change: "+15%" },
                    { label: "Avg. Sale", value: "R320", icon: TrendingUp, color: "glass", change: "+3%" }
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-2xl p-6 hover-lift cursor-pointer shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#DFC6C8]/10 blur-3xl rounded-full" />
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center`}>
                                <kpi.icon className="w-5 h-5 text-[#130E0E]" />
                            </div>
                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                {kpi.change}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-[#B6AFAE] uppercase tracking-wider">{kpi.label}</p>
                            <h3 className="text-2xl font-bold text-[#130E0E]">{kpi.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Revenue Distribution</h3>
                            <p className="text-sm text-[#B6AFAE]">Monthly tracking</p>
                        </div>
                    </div>
                    
                    <div className="h-[250px] flex items-end justify-between gap-4 mt-4">
                        {Object.entries(stats.revenueByMonth).map(([month, amount]) => (
                            <div key={month} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="text-[10px] font-bold text-[#B6AFAE] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    R{amount}
                                </div>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(amount / (stats.totalRevenue || 1)) * 200 + 40}px` }}
                                    className="w-full max-w-[40px] gradient-rose rounded-t-lg transition-all duration-300 relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                                <span className="text-xs font-bold text-[#130E0E]/60 uppercase tracking-widest">{month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Services */}
                <div className="glass rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-6">Service Mix</h3>
                    <div className="space-y-6">
                        {stats.topServices.map((service, i) => (
                            <div key={service.name} className="space-y-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold text-[#130E0E]/80">{service.name}</span>
                                    <span className="font-medium text-[#B6AFAE]">{service.count} bookings</span>
                                </div>
                                <div className="h-2 bg-[#DFC6C8]/20 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(service.count / stats.totalBookings) * 100}%` }}
                                        className="h-full gradient-rose"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="glass rounded-3xl p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#DFC6C8]/10">
                    <div>
                        <h3 className="text-xl font-bold">Recent Appointments</h3>
                        <p className="text-sm text-[#B6AFAE]">Real-time activity stream</p>
                    </div>
                    <button className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#DFC6C8] hover:text-[#130E0E] transition-colors">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-bold text-[#B6AFAE] uppercase tracking-widest">
                                <th className="pb-4 pt-4 px-4 font-bold">Client</th>
                                <th className="pb-4 pt-4 px-4 font-bold">Services</th>
                                <th className="pb-4 pt-4 px-4 font-bold">Date & Time</th>
                                <th className="pb-4 pt-4 px-4 font-bold">Amount</th>
                                <th className="pb-4 pt-4 px-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DFC6C8]/10">
                            {recentBookings?.map((booking) => (
                                <tr key={booking._id} className="group hover:bg-[#DFC6C8]/5 transition-colors">
                                    <td className="py-5 px-4">
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-bold text-[#130E0E]">{booking.name}</span>
                                            <span className="text-xs text-[#B6AFAE]">{booking.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 font-medium text-sm text-[#130E0E]">
                                        {booking.services.join(", ")}
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex flex-col text-sm">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-3 h-3 text-[#B6AFAE]" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-[#B6AFAE]">
                                                <Clock className="w-3 h-3" />
                                                {booking.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 font-bold text-[#130E0E]">
                                        R{booking.totalAmount}
                                    </td>
                                    <td className="py-5 px-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            booking.status === "paid" 
                                                ? "bg-green-500/10 text-green-600" 
                                                : booking.status === "pending"
                                                ? "bg-amber-500/10 text-amber-600"
                                                : "bg-red-500/10 text-red-600"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
