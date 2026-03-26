"use client";
import { SignInButton, SignUpButton, UserButton, Show, RedirectToSignIn } from "@clerk/nextjs";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Loader2, Calendar, AlertCircle, Clock } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { format } from "date-fns";
import { useForm } from "@formspree/react";
import {
    bookableServices,
    TIME_SLOTS,
    formatDuration,
    roundUpTo30,
    getBlockedSlots,
    wouldConflict,
    timeToMinutes,
} from "@/lib/serviceData";


export default function Booking() {
    const { user } = useUser();
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string | undefined>();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

    // Local session cache for immediately locking slots they just booked
    const [locallyBookedSlots, setLocallyBookedSlots] = useState<{ time: string; durationMinutes: number }[]>([]);

    useEffect(() => {
        if (!formattedDate) return;
        const saved = localStorage.getItem(`booked_${formattedDate}`);
        if (saved) setLocallyBookedSlots(JSON.parse(saved));
        else setLocallyBookedSlots([]);
    }, [formattedDate]);

    const bookedSlotsRaw = useQuery(api.bookings.getBookedSlots,
        formattedDate ? { date: formattedDate } : "skip"
    );
    const fullyBookedDays = useQuery(api.bookings.getFullyBookedDays);

    // Merge server + locally cached bookings
    const allBookedSlots = useMemo(() => {
        const merged: { time: string; durationMinutes: number }[] = [];
        if (bookedSlotsRaw) merged.push(...bookedSlotsRaw);
        merged.push(...locallyBookedSlots);
        return merged;
    }, [bookedSlotsRaw, locallyBookedSlots]);

    // Blocked set based on existing bookings and their durations
    const blockedSlots = useMemo(() => getBlockedSlots(allBookedSlots, TIME_SLOTS), [allBookedSlots]);

    // Convex Mutations
    const createBookingMutation = useMutation(api.bookings.createBooking);
    const confirmBookingMutation = useMutation(api.bookings.confirmBooking);

    // Formspree Hook
    const [formspreeState, sendToFormspree] = useForm("xojkkekr");

    // Toggle service selection
    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const total = selectedServices.reduce((sum, id) => {
        const service = bookableServices.find(s => s.id === id);
        return sum + (service?.price || 0);
    }, 0);

    // Total duration = sum of all selected service durations
    const totalDuration = useMemo(() => {
        return selectedServices.reduce((sum, id) => {
            const service = bookableServices.find(s => s.id === id);
            return sum + (service?.durationMinutes || 0);
        }, 0);
    }, [selectedServices]);

    const totalDurationRoundedSlots = Math.ceil((totalDuration || 60) / 30);


    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    // Check if selecting this slot would conflict given the user's chosen duration
    const isSlotAvailable = (slot: string): boolean => {
        if (blockedSlots.has(slot)) return false;
        // Also check if the user's booking at this slot would extend into a blocked range
        return !wouldConflict(slot, totalDuration || 60, allBookedSlots);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !date || !time) return;

        setIsSubmitting(true);
        try {
            let id = `offline_${Date.now()}`;

            // 1. Try to create pending booking in Convex
            if (createBookingMutation) {
                try {
                    id = await createBookingMutation({
                        name: formData.name,
                        email: formData.email || user.primaryEmailAddress?.emailAddress || "",
                        phone: formData.phone,
                        date: format(date, "yyyy-MM-dd"),
                        time: time,
                        services: selectedServices,
                        totalAmount: total,
                        depositAmount: 100,
                        notes: formData.notes,
                        userId: user.id,
                        durationMinutes: totalDuration || 60,
                    });
                } catch (e) {
                    console.warn("Convex mutation failed, proceeding with manual ID for testing:", e);
                }
            }

            setBookingId(id);

            // 2. Initialize Paystack
            if (!(window as any).PaystackPop) {
                alert("Payment system is still loading. Please wait a moment and try again.");
                setIsSubmitting(false);
                return;
            }

            const handler = (window as any).PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: formData.email || user.primaryEmailAddress?.emailAddress || "customer@example.com",
                amount: 100 * 100, // 100 ZAR in kobo
                currency: "ZAR",
                ref: id,
                callback: function (response: any) {
                    // 1. Optimistically mark as booked in local storage
                    const newSlot = { time: time!, durationMinutes: totalDuration || 60 };
                    const currentLocal = JSON.parse(localStorage.getItem(`booked_${formattedDate}`) || "[]");
                    const nextLocal = [...currentLocal, newSlot];
                    localStorage.setItem(`booked_${formattedDate}`, JSON.stringify(nextLocal));
                    setLocallyBookedSlots(nextLocal);

                    // 2. Update booking status in Convex & Send Confirmation Email
                    const handleSuccess = async () => {
                        try {
                            if (confirmBookingMutation && id && !id.startsWith("offline_")) {
                                await confirmBookingMutation({
                                    id: id as any,
                                    paystackReference: response.reference,
                                });
                            }

                            // 3. Send Confirmation Email via Formspree
                            await sendToFormspree({
                                email: formData.email,
                                subject: "Booking Confirmed - Hazelnailz x Ikonique",
                                message: `Your booking has been made for ${formattedDate} at ${time}. 

Please remember to arrive 15 minutes early for your appointment to ensure we have enough time to give you the full luxury experience.

Looking forward to seeing you soon and making your nails look iconic!

love, Ikonique`,
                                date: formattedDate,
                                time: time,
                                services: selectedServices.map(sid => bookableServices.find(so => so.id === sid)?.name).join(", "),
                                phone: formData.phone,
                                name: formData.name
                            });
                        } catch (e) {
                            console.error("Failed to confirm booking or send email:", e);
                        }
                        setStep(5);
                        setIsSubmitting(false);
                    };
                    handleSuccess();
                },
                onClose: function () {
                    setIsSubmitting(false);
                },
            });
            handler.openIframe();
        } catch (error) {
            console.error("Booking error:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Show when="signed-in">
                <main className="min-h-screen bg-[#FAF8F8]">
                    <Navbar />

                    {/* Hero Header */}
                    <section className="relative pt-32 pb-16 overflow-hidden">
                        <div className="absolute inset-0 bg-[#130E0E]"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-15"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#130E0E]/50 to-[#130E0E]"></div>

                        <div className="container mx-auto px-6 relative z-10 text-center">
                            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
                                Book Your <span className="text-gradient-rose">Appointment</span>
                            </h1>
                            <p className="text-lg text-[#B6AFAE] max-w-2xl mx-auto">
                                Secure your appointment with a R100 deposit
                            </p>
                        </div>
                    </section>

                    <div className="pb-20 container mx-auto px-4 max-w-3xl -mt-8 relative z-10">
                        <div className="glass rounded-3xl shadow-xl overflow-hidden">
                            {/* Progress Bar */}
                            <div className="flex bg-[#D7C2C2]/30 h-2">
                                <div className="h-full gradient-rose transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }}></div>
                            </div>

                            <div className="p-8">
                                {/* Step 1: Services */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                            <h2 className="text-xl font-bold text-[#130E0E]">Select Services</h2>
                                            <p className="text-xs text-[#130E0E]/60 bg-[#DFC6C8]/10 px-3 py-1.5 rounded-lg border border-[#DFC6C8]/20 italic">
                                                Note: Prices are for plain sets. Nail art/decoration is charged separately.
                                            </p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {bookableServices.map(service => (
                                                <div
                                                    key={service.id}
                                                    onClick={() => toggleService(service.id)}
                                                    className={cn(
                                                        "p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center",
                                                        selectedServices.includes(service.id)
                                                            ? "border-[#DFC6C8] bg-[#DFC6C8]/10 shadow-md"
                                                            : "border-[#D7C2C2]/50 hover:border-[#DFC6C8]/50"
                                                    )}
                                                >
                                                    <div>
                                                        <span className="font-medium text-[#130E0E]">{service.name}</span>
                                                        {service.durationMinutes > 0 && (
                                                            <span className="flex items-center gap-1 text-xs text-[#130E0E]/45 mt-0.5">
                                                                <Clock className="w-3 h-3" />
                                                                {formatDuration(service.durationMinutes)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-[#CFBDBE]">R{service.price}</div>
                                                        {selectedServices.includes(service.id) && <Check size={16} className="text-[#DFC6C8] ml-auto mt-1" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-6 border-t border-[#D7C2C2]">
                                            <div>
                                                <div className="font-bold text-lg text-[#130E0E]">Total: R{total}</div>
                                                {totalDuration > 0 && (
                                                    <div className="flex items-center gap-1 text-sm text-[#130E0E]/50">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Est. {formatDuration(totalDuration)}
                                                    </div>
                                                )}
                                            </div>
                                            <Button onClick={handleNext} disabled={selectedServices.length === 0} className="rounded-full px-8 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                Next <ChevronRight size={16} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Date & Time */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#130E0E]">Select Date & Time</h2>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#D7C2C2]/50">
                                                <DayPicker
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    disabled={[
                                                        { dayOfWeek: [1] }, // Closed Mondays
                                                        ...(fullyBookedDays?.map((d: string) => new Date(d)) || []),
                                                        { before: new Date() } // Can't book past dates
                                                    ]}
                                                    className="mx-auto"
                                                    modifiersClassNames={{
                                                        selected: "!bg-[#DFC6C8] !text-[#130E0E] hover:!bg-[#DFC6C8] hover:!text-[#130E0E] focus:!bg-[#DFC6C8] focus:!text-[#130E0E] rounded-full"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium text-sm text-[#B6AFAE] uppercase tracking-wide">Available Slots</h3>
                                                    {!bookedSlotsRaw && date && <Loader2 className="w-4 h-4 animate-spin text-[#DFC6C8]" />}
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {TIME_SLOTS.map(t => {
                                                        const available = isSlotAvailable(t);
                                                        const isBooked = !available;
                                                        return (
                                                            <button
                                                                key={t}
                                                                disabled={isBooked}
                                                                onClick={() => setTime(t)}
                                                                className={cn(
                                                                    "py-2 px-3 rounded-lg text-sm border transition-all cursor-pointer relative",
                                                                    time === t
                                                                        ? "gradient-rose text-[#130E0E] border-[#DFC6C8] font-semibold"
                                                                        : isBooked
                                                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                                                            : "border-[#D7C2C2]/50 hover:border-[#DFC6C8]/50 text-[#130E0E]/70"
                                                                )}
                                                            >
                                                                {t}
                                                                {isBooked && <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter opacity-20">Full</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-[#D7C2C2]">
                                            <Button variant="outline" onClick={handleBack} className="rounded-full border-[#D7C2C2] text-[#130E0E] hover:bg-[#D7C2C2]/20 cursor-pointer">Back</Button>
                                            <Button onClick={handleNext} disabled={!date || !time} className="rounded-full px-8 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                Next <ChevronRight size={16} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Details */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                                        <h2 className="text-xl font-bold text-[#130E0E]">Your Details</h2>
                                        <div className="grid gap-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-[#130E0E]">Name</label>
                                                    <input
                                                        className="w-full p-3 border border-[#D7C2C2] rounded-xl focus:ring-2 focus:ring-[#DFC6C8]/40 focus:border-[#DFC6C8] outline-none transition-all bg-white"
                                                        placeholder="Jane Doe"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-[#130E0E]">Phone</label>
                                                    <input
                                                        className="w-full p-3 border border-[#D7C2C2] rounded-xl focus:ring-2 focus:ring-[#DFC6C8]/40 focus:border-[#DFC6C8] outline-none transition-all bg-white"
                                                        placeholder="082 123 4567"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[#130E0E]">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full p-3 border border-[#D7C2C2] rounded-xl focus:ring-2 focus:ring-[#DFC6C8]/40 focus:border-[#DFC6C8] outline-none transition-all bg-white"
                                                    placeholder="jane@example.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-[#130E0E]">Notes (Optional)</label>
                                                <textarea
                                                    className="w-full p-3 border border-[#D7C2C2] rounded-xl focus:ring-2 focus:ring-[#DFC6C8]/40 focus:border-[#DFC6C8] outline-none transition-all min-h-[100px] bg-white"
                                                    placeholder="Any specific requests or allergies?"
                                                    value={formData.notes}
                                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-[#D7C2C2]">
                                            <Button variant="outline" onClick={handleBack} className="rounded-full border-[#D7C2C2] text-[#130E0E] hover:bg-[#D7C2C2]/20 cursor-pointer">Back</Button>
                                            <Button onClick={handleNext} disabled={!formData.name || !formData.phone} className="rounded-full px-8 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                Next <ChevronRight size={16} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Review & Payment */}
                                {step === 4 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                                        <h2 className="text-xl font-bold text-[#130E0E]">Confirm & Pay Deposit</h2>

                                        <div className="bg-[#D7C2C2]/30 p-6 rounded-2xl space-y-4">
                                            <div className="flex justify-between border-b border-[#DFC6C8]/20 pb-2">
                                                <span className="text-[#130E0E]/70">Service Total</span>
                                                <span className="font-bold text-[#130E0E]">R{total}</span>
                                            </div>
                                            {totalDuration > 0 && (
                                                <div className="flex justify-between border-b border-[#DFC6C8]/20 pb-2">
                                                    <span className="text-[#130E0E]/70 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration</span>
                                                    <span className="font-medium text-[#130E0E]">{formatDuration(totalDuration)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-b border-[#DFC6C8]/20 pb-2 text-[#130E0E]">
                                                <span className="font-bold">Deposit Due Now</span>
                                                <span className="font-bold text-lg">R100.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-[#130E0E]/60">
                                                <span>Remaining Balance (Pay in store)</span>
                                                <span>R{total - 100}</span>
                                            </div>
                                        </div>

                                        <div className="bg-[#DFC6C8]/20 border border-[#DFC6C8]/40 p-4 rounded-xl text-sm text-[#130E0E]">
                                            <strong>Note:</strong> Your appointment is only confirmed once the R100 deposit is received.
                                            Please use your name as reference.
                                        </div>

                                        {/* Payment Options */}
                                        <div className="space-y-3">
                                            <h3 className="font-medium text-[#130E0E]">Payment Method</h3>
                                            <div className="p-4 border-2 border-[#DFC6C8] bg-[#DFC6C8]/10 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-[#130E0E] mb-1">Pay with Paystack</div>
                                                    <p className="text-xs text-[#130E0E]/70 underline decoration-[#DFC6C8]">Secure Card & Instant EFT Payment</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="w-8 h-5 bg-white rounded border border-gray-100 flex items-center justify-center p-1"><img src="https://js.paystack.co/v2/packages/inline/assets/images/paystack-logo.png" alt="Paystack" className="grayscale contrast-125" /></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-[#D7C2C2]">
                                            <Button variant="outline" onClick={handleBack} className="rounded-full border-[#D7C2C2] text-[#130E0E] hover:bg-[#D7C2C2]/20 cursor-pointer">Back</Button>
                                            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-8 w-full ml-4 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : `Pay R100 Deposit`}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Success */}
                                {step === 5 && (
                                    <div className="text-center py-12 animate-in zoom-in duration-500">
                                        <div className="w-20 h-20 gradient-rose rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#DFC6C8]/30">
                                            <Check size={40} className="text-[#130E0E]" />
                                        </div>
                                        <h2 className="font-serif text-3xl font-bold mb-4 text-[#130E0E]">Booking Confirmed!</h2>
                                        <p className="text-[#130E0E]/60 max-w-md mx-auto mb-8">
                                            Thank you, {formData.name}. Your appointment for <strong>{date?.toLocaleDateString()} at {time}</strong> is officially secured.
                                            You will receive a confirmation email shortly.
                                        </p>
                                        <Button asChild size="lg" className="rounded-full px-8 bg-[#130E0E] hover:bg-[#130E0E]/90 text-white font-semibold cursor-pointer">
                                            <Link href="/">Back to Home</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer />
                    <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
                </main>
            </Show>
            <Show when="signed-out">
                <RedirectToSignIn />
            </Show>
        </>
    );
}
