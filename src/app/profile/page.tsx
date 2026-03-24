"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Calendar, Clock, CreditCard, ChevronRight, Package, User, LogOut, CheckCircle2, History, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookableServices, formatDuration } from "@/lib/serviceData";
import { format, isAfter, isBefore, parseISO, startOfDay } from "date-fns";

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState<"profile" | "appointments">("appointments");

    const bookings = useQuery(api.bookings.getUserBookings, 
        user?.id ? { userId: user.id } : "skip"
    );

    const tabs = [
        { id: "appointments", label: "My Appointments", icon: Calendar },
        { id: "profile", label: "Profile Settings", icon: User },
    ];

    const upcomingBookings = bookings?.filter(b => {
        const appointmentDate = parseISO(b.date);
        return (b.status === "paid" || b.status === "pending") && (isAfter(appointmentDate, startOfDay(new Date())) || b.date === format(new Date(), "yyyy-MM-dd"));
    }) || [];

    const pastBookings = bookings?.filter(b => {
        const appointmentDate = parseISO(b.date);
        return b.status === "cancelled" || (isBefore(appointmentDate, startOfDay(new Date())) && b.date !== format(new Date(), "yyyy-MM-dd"));
    }) || [];

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#FAF8F8]">
                {/* Hero */}
                <section className="relative h-[250px] gradient-premium overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-[#DFC6C8]/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] bg-[#DFC6C8]/5 blur-[100px] rounded-full" />
                    </div>
                    <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-4">
                                <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">Customer Dashboard</span>
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                                Welcome, <span className="text-gradient-rose">{user?.firstName || "Guest"}</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                <section className="container mx-auto px-6 -mt-8 relative z-20 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="w-full lg:w-72 shrink-0">
                            <div className="glass rounded-3xl p-4 sticky top-24">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                                                activeTab === tab.id
                                                    ? "bg-[#DFC6C8]/20 text-[#130E0E] font-bold shadow-sm"
                                                    : "text-[#130E0E]/60 hover:bg-white hover:text-[#130E0E]"
                                            )}
                                        >
                                            <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-[#DFC6C8]" : "text-[#B6AFAE]")} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {activeTab === "profile" && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="glass rounded-3xl overflow-hidden shadow-xl"
                                    >
                                        <UserProfile
                                            appearance={{
                                                elements: {
                                                    rootBox: "w-full",
                                                    cardBox: "w-full max-w-none shadow-none border-0",
                                                    card: "shadow-none border-0 bg-transparent",
                                                    navbar: "hidden", // We have our own sidebar
                                                    pageScrollBox: "p-8",
                                                    page: "gap-8",
                                                    profileSection: "gap-4",
                                                    profileSectionTitle: "font-serif text-xl font-bold text-[#130E0E] border-b border-[#DFC6C8]/20 pb-4",
                                                    profileSectionContent: "gap-4",
                                                    profileSectionPrimaryButton: "gradient-rose text-[#130E0E] font-bold rounded-xl hover-glow border-0 shadow-md",
                                                    formButtonPrimary: "gradient-rose text-[#130E0E] font-bold rounded-xl hover-glow border-0 shadow-md",
                                                    formFieldInput: "rounded-xl border-[#DFC6C8]/30 focus:border-[#DFC6C8] focus:ring-[#DFC6C8]/30",
                                                    avatarBox: "w-20 h-20 rounded-2xl",
                                                    avatarImageActionsUpload: "gradient-rose text-[#130E0E] font-bold rounded-xl border-0",
                                                    badge: "bg-[#DFC6C8]/20 text-[#130E0E] font-bold rounded-lg",
                                                    headerTitle: "font-serif text-2xl font-bold text-[#130E0E]",
                                                    headerSubtitle: "text-[#B6AFAE]",
                                                }
                                            }}
                                        />
                                    </motion.div>
                                )}

                                {activeTab === "appointments" && (
                                    <motion.div
                                        key="appointments"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-8"
                                    >
                                        {/* Upcoming */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-10 h-10 rounded-2xl bg-[#DFC6C8]/20 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-[#DFC6C8]" />
                                                </div>
                                                <h2 className="font-serif text-2xl font-bold text-[#130E0E]">Upcoming Appointments</h2>
                                            </div>

                                            {!bookings && (
                                                <div className="flex justify-center py-12">
                                                    <Loader2 className="w-8 h-8 animate-spin text-[#DFC6C8]" />
                                                </div>
                                            )}

                                            {bookings && upcomingBookings.length === 0 && (
                                                <div className="glass rounded-3xl p-12 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                                        <Calendar className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-[#130E0E]/60 text-lg">No upcoming appointments</p>
                                                    <Button asChild className="mt-6 gradient-rose rounded-full px-8">
                                                        <Link href="/booking">Book Your First Session</Link>
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="grid gap-4">
                                                {upcomingBookings.map((b) => (
                                                    <AppointmentCard key={b._id} booking={b} isUpcoming />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Past */}
                                        {pastBookings.length > 0 && (
                                            <div className="space-y-4 pt-8">
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                        <History className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <h2 className="font-serif text-2xl font-bold text-[#130E0E]">Past Appointments</h2>
                                                </div>
                                                <div className="grid gap-4">
                                                    {pastBookings.map((b) => (
                                                        <AppointmentCard key={b._id} booking={b} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

function AppointmentCard({ booking, isUpcoming = false }: { booking: any, isUpcoming?: boolean }) {
    const cancelBooking = useMutation(api.bookings.cancelBooking);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        setIsCancelling(true);
        try {
            await cancelBooking({ id: booking._id });
        } catch (e) {
            console.error("Failed to cancel:", e);
        } finally {
            setIsCancelling(false);
        }
    };

    const serviceNames = booking.services.map((sid: string) => 
        bookableServices.find(s => s.id === sid)?.name || sid
    ).join(", ");

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={cn(
                "glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between",
                !isUpcoming && "opacity-75 grayscale-[0.5]"
            )}
        >
            <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                {/* Date & Time Block */}
                <div className="flex flex-col items-center justify-center min-w-[100px] py-4 px-4 bg-[#DFC6C8]/10 rounded-2xl">
                    <span className="text-sm font-bold text-[#DFC6C8] uppercase tracking-wider">{format(parseISO(booking.date), "EEE")}</span>
                    <span className="text-3xl font-bold text-[#130E0E]">{format(parseISO(booking.date), "dd")}</span>
                    <span className="text-sm text-[#130E0E]/60">{format(parseISO(booking.date), "MMM yyyy")}</span>
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="font-bold text-xl text-[#130E0E]">{booking.name}</span>
                        <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            booking.status === "paid" ? "bg-green-100 text-green-600" : 
                            booking.status === "pending" ? "bg-yellow-100 text-yellow-600" : 
                            "bg-red-100 text-red-600"
                        )}>
                            {booking.status}
                        </div>
                    </div>
                    <p className="text-[#130E0E]/70 font-medium">{serviceNames}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#B6AFAE]">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                        </div>
                        {booking.durationMinutes && (
                            <div className="flex items-center gap-1.5">
                                <Package className="w-4 h-4" />
                                {formatDuration(booking.durationMinutes)}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4" />
                            R{booking.totalAmount}
                        </div>
                    </div>
                </div>
            </div>

            {isUpcoming && booking.status !== "cancelled" && (
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-bold"
                    >
                        {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                        Cancel
                    </button>
                    <div className="w-12 h-12 rounded-full border border-[#DFC6C8]/30 flex items-center justify-center text-[#DFC6C8] hover:bg-[#DFC6C8]/10 transition-colors">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// Simple internal components to avoid extra imports if possible, or just use what we have
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
