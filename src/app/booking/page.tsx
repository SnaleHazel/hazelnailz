"use client";
import { SignInButton, SignUpButton, UserButton, Show, RedirectToSignIn } from "@clerk/nextjs";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Loader2, Sparkles, Calendar } from "lucide-react";

// Mock Services Data
const serviceOptions = [
    { id: "acrylic-new", name: "Acrylic New Set", price: 300 },
    { id: "acrylic-refill", name: "Acrylic Refill", price: 250 },
    { id: "gel-overlay", name: "Gel Overlay", price: 250 },
    { id: "toes-overlay", name: "Toes Overlay", price: 200 },
    { id: "soak-off", name: "Soak Off", price: 50 },
    { id: "nail-art", name: "Nail Art Add-on", price: 50 },
];

export default function Booking() {
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string | undefined>();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toggle service selection
    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const total = selectedServices.reduce((sum, id) => {
        const service = serviceOptions.find(s => s.id === id);
        return sum + (service?.price || 0);
    }, 0);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStep(5); // Success step
        setIsSubmitting(false);
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
                            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-6">
                                <Calendar className="w-4 h-4 text-[#DFC6C8]" />
                                <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">Secure Your Spot</span>
                            </div>
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
                                        <h2 className="text-xl font-bold text-[#130E0E]">Select Services</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {serviceOptions.map(service => (
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
                                                    <span className="font-medium text-[#130E0E]">{service.name}</span>
                                                    <div className="text-right">
                                                        <div className="font-bold text-[#CFBDBE]">R{service.price}</div>
                                                        {selectedServices.includes(service.id) && <Check size={16} className="text-[#DFC6C8] ml-auto mt-1" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-[#D7C2C2]">
                                            <div className="font-bold text-lg text-[#130E0E]">Total: R{total}</div>
                                            <Button onClick={handleNext} disabled={selectedServices.length === 0} className="rounded-full px-8 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                Next <ChevronRight size={16} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Date & Time */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                                        <h2 className="text-xl font-bold text-[#130E0E]">Select Date & Time</h2>
                                        <div className="flex flex-col md:flex-row gap-8 justify-center">
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#D7C2C2]/50">
                                                <DayPicker
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    disabled={[{ dayOfWeek: [1] }]} // Closed Mondays
                                                    className="mx-auto"
                                                    modifiersClassNames={{
                                                        selected: "!bg-[#DFC6C8] !text-[#130E0E] hover:!bg-[#DFC6C8] hover:!text-[#130E0E] focus:!bg-[#DFC6C8] focus:!text-[#130E0E] rounded-full"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <h3 className="font-medium text-sm text-[#B6AFAE] uppercase tracking-wide">Available Slots</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setTime(t)}
                                                            className={cn(
                                                                "py-2 px-4 rounded-lg text-sm border transition-all cursor-pointer",
                                                                time === t
                                                                    ? "gradient-rose text-[#130E0E] border-[#DFC6C8] font-semibold"
                                                                    : "border-[#D7C2C2]/50 hover:border-[#DFC6C8]/50 text-[#130E0E]/70"
                                                            )}
                                                        >
                                                            {t} {['17:30'].includes(t) && <span className="text-[10px] block opacity-70">(+R100)</span>}
                                                        </button>
                                                    ))}
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
                                            <div className="p-4 border border-[#D7C2C2] rounded-xl bg-[#D7C2C2]/20 opacity-50 cursor-not-allowed text-[#130E0E]/60">
                                                Credit Card (Coming Soon)
                                            </div>
                                            <div className="p-4 border-2 border-[#DFC6C8] bg-[#DFC6C8]/10 rounded-xl">
                                                <div className="font-bold text-[#130E0E] mb-2">EFT Transfer</div>
                                                <p className="text-sm text-[#130E0E]/70">Bank: Capitec<br />Acc: 1234567890<br />Branch: 470010<br />Ref: {formData.name}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-[#D7C2C2]">
                                            <Button variant="outline" onClick={handleBack} className="rounded-full border-[#D7C2C2] text-[#130E0E] hover:bg-[#D7C2C2]/20 cursor-pointer">Back</Button>
                                            <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full px-8 w-full ml-4 gradient-rose text-[#130E0E] font-semibold hover-glow cursor-pointer">
                                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Confirm Booking"}
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
                                        <h2 className="font-serif text-3xl font-bold mb-4 text-[#130E0E]">Booking Request Sent!</h2>
                                        <p className="text-[#130E0E]/60 max-w-md mx-auto mb-8">
                                            Thank you, {formData.name}. We have received your request for <strong>{date?.toLocaleDateString()} at {time}</strong>.
                                            Please send proof of payment to confirm your slot.
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
                    <WhatsAppButton />
                </main>
            </Show>
            <Show when="signed-out">
                <RedirectToSignIn />
            </Show>
        </>
    );
}
