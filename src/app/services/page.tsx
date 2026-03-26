import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { services, formatDuration } from "@/lib/serviceData";

export default function Services() {
    return (
        <main className="min-h-screen bg-[#FAF8F8]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[#130E0E]"></div>
                <div className="absolute inset-0 bg-[url('/images/1773975778899.jpg')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#130E0E]/50 to-[#130E0E]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-6">
                        
                        <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">2025 Price List</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">
                        Service <span className="text-gradient-rose">Menu</span>
                    </h1>
                    <p className="text-lg text-[#B6AFAE] max-w-2xl mx-auto mb-6">
                        Premium nail services crafted with precision and luxury in mind
                    </p>
                    <div className="inline-block glass-dark rounded-lg px-6 py-3 border border-[#DFC6C8]/20">
                        <p className="text-sm text-[#DFC6C8]/80 font-medium">
                            <span className="text-[#DFC6C8] font-bold">Note:</span> Prices shown are for plain sets. 
                            Nail art and decoration are charged separately.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 container mx-auto px-6 max-w-6xl">
                <div className="space-y-16">
                    {services.map((category, idx) => (
                        <div
                            key={category.category}
                            className="scroll-mt-24"
                            id={category.category.toLowerCase().replace(/\s/g, '-')}
                        >
                            {/* Category Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#D7C2C2]">
                                <div>
                                    <span className="text-[#CFBDBE] font-medium text-sm tracking-widest uppercase mb-2 block">
                                        0{idx + 1}
                                    </span>
                                    <h2 className="font-serif text-4xl font-bold text-[#130E0E]">
                                        {category.category}
                                    </h2>
                                    <p className="text-[#130E0E]/60 mt-1">{category.description}</p>
                                </div>
                                <Button
                                    asChild
                                    className="mt-4 md:mt-0 rounded-full gradient-rose text-[#130E0E] font-semibold px-6 hover-glow cursor-pointer group"
                                >
                                    <Link href="/booking" className="flex items-center gap-2">
                                        Book Now
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Service Items */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {category.items.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group glass rounded-xl p-5 hover-lift cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-[#DFC6C8] group-hover:scale-150 transition-transform"></div>
                                            <span className="font-medium text-[#130E0E]/80 group-hover:text-[#130E0E] transition-colors">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Duration Badge */}
                                            {item.durationMinutes > 0 && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#130E0E]/50 bg-[#DFC6C8]/15 rounded-full px-2.5 py-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDuration(item.durationMinutes)}
                                                </span>
                                            )}
                                            <span className="font-bold text-[#CFBDBE] text-lg">
                                                {item.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Incentives Banner */}
            <section className="py-20 bg-[#130E0E] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>
                <div className="absolute inset-0 pattern-dots opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 mb-4">
                            
                            <span className="text-[#DFC6C8] font-semibold tracking-widest uppercase text-sm">Special Offers</span>
                        </div>
                        <h3 className="font-serif text-4xl font-bold text-white">Client Incentives</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                title: "Toe Tuesdays & Wellness Wednesdays",
                                offer: "25% off toe services",
                                
                            },
                            {
                                title: "Refer & Reward",
                                offer: "R100 off your next appointment",
                                
                            },
                            {
                                title: "Loyalty Love",
                                offer: "5th visit is 50% off!",
                                
                            },
                        ].map((incentive, i) => (
                            <div key={i} className="glass-dark rounded-2xl p-6 text-center hover-lift cursor-pointer">
                                <h4 className="font-semibold text-white mb-2">{incentive.title}</h4>
                                <p className="text-[#DFC6C8] font-medium">{incentive.offer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
