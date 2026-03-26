"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { 
    Calendar, 
    Search, 
    Filter, 
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Mail,
    Phone,
    FileText
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "@clerk/nextjs";
import { isUserAdmin } from "@/lib/admin";

export default function AdminBookings() {
    const { isLoaded, user } = useUser();
    const isAdmin = isUserAdmin(user);

    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const bookings = useQuery(api.admin.listAllBookings, !isAdmin ? "skip" : { status: statusFilter });
    const updateStatus = useMutation(api.admin.updateBookingStatus);

    const filteredBookings = bookings?.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm)
    );

    const handleStatusUpdate = async (id: any, status: any) => {
         await updateStatus({ id, status });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-[#130E0E]">Appointments</h1>
                    <p className="text-[#B6AFAE] mt-2">Manage all studio sessions and logs</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6AFAE]" />
                        <input 
                            type="text" 
                            placeholder="Search client..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass pl-12 pr-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFC6C8]/50 transition-all w-[240px]"
                        />
                    </div>
                    <div className="flex glass rounded-2xl p-1">
                        {["all", "paid", "pending", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status === "all" ? undefined : status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    (status === "all" && !statusFilter) || (status === statusFilter)
                                        ? "bg-white text-[#130E0E] shadow-sm"
                                        : "text-[#B6AFAE] hover:text-[#130E0E]"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredBookings?.map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="glass rounded-3xl p-6 hover-lift border border-transparent hover:border-[#DFC6C8]/30 transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Client Info */}
                                <div className="flex items-start gap-5 min-w-[300px]">
                                    <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center text-[#DFC6C8] font-bold text-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        {booking.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1 overflow-hidden">
                                        <h4 className="font-bold text-[#130E0E] text-lg truncate">{booking.name}</h4>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-[#B6AFAE]">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{booking.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[#B6AFAE]">
                                                <Phone className="w-3 h-3" />
                                                <span>{booking.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:items-center gap-8 flex-1">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest">Date & Time</p>
                                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#130E0E]">
                                            <Calendar className="w-4 h-4 text-[#DFC6C8]" />
                                            {booking.date} @ {booking.time}
                                        </div>
                                    </div>

                                    <div className="space-y-1 min-w-[150px]">
                                        <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest">Services</p>
                                        <p className="font-medium text-sm text-[#130E0E]/80 truncate leading-relaxed">
                                            {booking.services.join(", ")}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest">Financials</p>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#130E0E]">R{booking.totalAmount} Total</span>
                                            <span className="text-[10px] font-medium text-[#B6AFAE]">Deposit: R{booking.depositAmount}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest">Status</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            booking.status === "paid" 
                                                ? "bg-green-500/10 text-green-600" 
                                                : booking.status === "pending"
                                                ? "bg-amber-500/10 text-amber-600"
                                                : "bg-red-500/10 text-red-600"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {booking.status === "pending" && (
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, "paid")}
                                            className="p-3 text-green-600 hover:bg-green-500/10 rounded-2xl transition-all"
                                            title="Mark as Paid"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    {booking.status !== "cancelled" && (
                                        <button 
                                            onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                            className="p-3 text-red-600 hover:bg-red-500/10 rounded-2xl transition-all"
                                            title="Cancel Session"
                                        >
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="p-3 text-[#B6AFAE] hover:bg-[#DFC6C8]/10 rounded-2xl transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="mt-4 pt-4 border-t border-[#DFC6C8]/10 flex items-start gap-4 text-xs italic text-[#B6AFAE]">
                                    <FileText className="w-4 h-4 shrink-0 text-[#DFC6C8]" />
                                    "{booking.notes}"
                                </div>
                            )}
                        </motion.div>
                    ))}
                    
                    {filteredBookings?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#DFC6C8]/10 flex items-center justify-center">
                                <Search className="w-8 h-8 text-[#B6AFAE]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#130E0E]">No appointments found</h4>
                                <p className="text-sm text-[#B6AFAE]">Try adjusting your search or filters</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
