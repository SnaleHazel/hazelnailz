"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { 
    Users, 
    Search, 
    Mail, 
    Phone, 
    Calendar, 
    DollarSign,
    MoreVertical,
    Star,
    ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { useUser } from "@clerk/nextjs";

export default function AdminClients() {
    const { isLoaded, user } = useUser();
    const isAdmin = user?.primaryEmailAddress?.emailAddress === "lgumbi2169@gmail.com";

    const [searchTerm, setSearchTerm] = useState("");
    const clients = useQuery(api.admin.listClients, !isAdmin ? "skip" : {});

    const filteredClients = clients?.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-[#130E0E]">Clients</h1>
                    <p className="text-[#B6AFAE] mt-2">Manage relations and client history</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6AFAE]" />
                        <input 
                            type="text" 
                            placeholder="Search name, email, phone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass pl-12 pr-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DFC6C8]/50 transition-all w-[300px]"
                        />
                    </div>
                </div>
            </div>

            {/* Client Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients?.map((client, i) => (
                    <motion.div
                        key={client.email}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-3xl p-6 hover-lift group relative overflow-hidden"
                    >
                        {/* Background flare */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#DFC6C8]/10 blur-3xl rounded-full" />
                        
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl gradient-rose flex items-center justify-center text-[#130E0E] font-bold text-xl group-hover:scale-105 transition-transform duration-500">
                                    {client.name.charAt(0)}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-[#130E0E] text-lg">{client.name}</h4>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                        Frequent
                                    </span>
                                </div>
                            </div>
                            <button className="text-[#B6AFAE] hover:text-[#130E0E] transition-colors p-1">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* CRM stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-[#DFC6C8]/10 rounded-2xl border border-[#DFC6C8]/5">
                                <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest mb-1">Bookings</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#130E0E]">{client.totalBookings}</span>
                                    <Calendar className="w-3.5 h-3.5 text-[#DFC6C8]" />
                                </div>
                            </div>
                            <div className="p-4 bg-[#DFC6C8]/10 rounded-2xl border border-[#DFC6C8]/5">
                                <p className="text-[10px] font-bold text-[#B6AFAE] uppercase tracking-widest mb-1">Spent</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#130E0E]">R{client.totalSpent}</span>
                                    <DollarSign className="w-3.5 h-3.5 text-[#DFC6C8]" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 pb-4 border-b border-[#DFC6C8]/10 mb-4">
                            <div className="flex items-center gap-3 text-sm text-[#130E0E]/70">
                                <Mail className="w-4 h-4 text-[#B6AFAE]" />
                                {client.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#130E0E]/70">
                                <Phone className="w-4 h-4 text-[#B6AFAE]" />
                                {client.phone}
                            </div>
                        </div>

                        {/* Bio / History line */}
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#B6AFAE] uppercase tracking-widest">
                            <span>Last visit: {client.lastBooking}</span>
                            <button className="flex items-center gap-1 text-[#DFC6C8] hover:text-[#130E0E] transition-colors">
                                View Profile
                                <ArrowUpRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredClients?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#DFC6C8]/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-[#B6AFAE]" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#130E0E]">No clients found</h4>
                        <p className="text-sm text-[#B6AFAE]">Try searching for name, email, or phone number</p>
                    </div>
                </div>
            )}
        </div>
    );
}
