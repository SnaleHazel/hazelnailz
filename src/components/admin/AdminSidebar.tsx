"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    ChevronLeft,
    LogOut,
    Menu,
    X,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { name: "Analytics", href: "/admin", icon: TrendingUp },
    { name: "Appointments", href: "/admin/bookings", icon: Calendar },
    { name: "Clients", href: "/admin/clients", icon: Users },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-dark z-[60] flex items-center justify-between px-6 border-b border-[#DFC6C8]/10">
                <span className="font-serif text-xl font-bold text-white tracking-tight">Admin Console</span>
                <button 
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full bg-[#130E0E] border-r border-[#DFC6C8]/10 z-[80] transition-all duration-500 ease-in-out",
                isCollapsed ? "w-20" : "w-64",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo & Toggle */}
                <div className="h-24 flex items-center justify-between px-6 border-b border-[#DFC6C8]/10">
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-serif text-xl font-bold text-white tracking-tight leading-none">Hazelnailz</span>
                            <span className="text-[8px] font-medium tracking-[0.3em] uppercase text-[#DFC6C8] mt-1">Admin Panel</span>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 hover:bg-white/5 rounded-lg text-[#DFC6C8] transition-colors"
                    >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500", isCollapsed && "rotate-180")} />
                    </button>
                    <button 
                        className="lg:hidden text-white"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                    isActive 
                                        ? "bg-[#DFC6C8] text-[#130E0E] shadow-lg shadow-[#DFC6C8]/20" 
                                        : "text-[#B6AFAE] hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-[#130E0E]" : "group-hover:text-[#DFC6C8] transition-colors")} />
                                {!isCollapsed && <span className="font-medium tracking-wide">{item.name}</span>}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-6 px-3 py-1 bg-white text-[#130E0E] text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#DFC6C8]/10 bg-[#130E0E]">
                    <div className={cn(
                        "flex items-center gap-4 p-3 rounded-xl bg-white/5",
                        isCollapsed ? "justify-center" : "px-4"
                    )}>
                        <UserButton />
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-bold text-white truncate">Studio Owner</span>
                                <span className="text-[10px] text-[#B6AFAE] truncate">admin@hazelnailz.co.za</span>
                            </div>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 mt-4 px-4 py-2 text-xs font-medium text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors"
                        >
                            <LogOut className="w-3 h-3" />
                            Back to Site
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
