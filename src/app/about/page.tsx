import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Sparkles, Heart, ArrowRight } from "lucide-react";

export default function About() {
    return (
        <main className="min-h-screen bg-[#FAF8F8]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[#130E0E]"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#130E0E]/50 to-[#130E0E]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-6">
                        <Heart className="w-4 h-4 text-[#DFC6C8]" />
                        <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">Est. 2020</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">
                        Our <span className="text-gradient-rose">Story</span>
                    </h1>
                    <p className="text-lg text-[#B6AFAE] max-w-2xl mx-auto">
                        Founded on the principle that beauty is a discipline, where passion meets precision
                    </p>
                </div>
            </section>

            {/* Meet the Artist */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative">
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                            </div>
                            {/* Floating accent */}
                            <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 shadow-xl max-w-xs">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full gradient-rose flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-[#130E0E]" />
                                    </div>
                                    <span className="font-serif text-lg font-bold text-[#130E0E]">5+ Years</span>
                                </div>
                                <p className="text-sm text-[#130E0E]/60">Of crafting iconic nail experiences</p>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="space-y-6">
                            <span className="text-[#CFBDBE] uppercase tracking-widest text-sm font-semibold">The Artist</span>
                            <h2 className="font-serif text-5xl font-bold text-[#130E0E]">
                                Precision & <span className="text-gradient-rose">Passion</span>
                            </h2>
                            <p className="text-[#130E0E]/60 leading-relaxed text-lg">
                                I am Hazel, the creative force behind Hazelnailz. My journey began with a simple fascination
                                for colors and textures, evolving into a dedicated pursuit of master-level nail technology.
                            </p>
                            <p className="text-[#130E0E]/60 leading-relaxed text-lg">
                                At IKONIQUE, we don&apos;t just &quot;do nails.&quot; We curate a look that complements your lifestyle,
                                enhances your confidence, and prioritizes the health of your natural nails.
                            </p>
                            <div className="pt-4">
                                <Button asChild className="rounded-full gradient-rose text-[#130E0E] font-semibold px-8 py-6 hover-glow cursor-pointer group">
                                    <Link href="/booking" className="flex items-center gap-2">
                                        Book With Me
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-[#130E0E] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>
                <div className="absolute inset-0 pattern-dots opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#DFC6C8] font-semibold tracking-widest uppercase text-sm mb-4 block">Our Values</span>
                        <h2 className="font-serif text-5xl font-bold text-white">
                            The <span className="text-gradient-rose">IKONIQUE</span> Standard
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                number: "01",
                                title: "Hygiene First",
                                description: "Medical-grade sterilization for every tool. Your health is non-negotiable.",
                                icon: Shield
                            },
                            {
                                number: "02",
                                title: "Premium Products",
                                description: "Only high-end, hypoallergenic gels and acrylics that last.",
                                icon: Sparkles
                            },
                            {
                                number: "03",
                                title: "Pure Artistry",
                                description: "From minimalist structured gel to intricate hand-painted masterpieces.",
                                icon: Heart
                            }
                        ].map((value, i) => (
                            <div key={i} className="glass-dark rounded-2xl p-8 text-center hover-lift cursor-pointer group">
                                <div className="w-16 h-16 rounded-2xl gradient-rose flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="w-8 h-8 text-[#130E0E]" />
                                </div>
                                <span className="text-[#DFC6C8] font-mono text-sm mb-2 block">{value.number}</span>
                                <h3 className="font-serif text-2xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-[#B6AFAE] leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 relative overflow-hidden bg-[#D7C2C2]/30">
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#130E0E]">
                        Ready to Experience the <span className="text-gradient-rose">Difference</span>?
                    </h2>
                    <p className="text-lg text-[#130E0E]/60 mb-10 max-w-2xl mx-auto">
                        Join our community of confident, stylish clients who trust us with their nail care.
                    </p>
                    <Button asChild size="lg" className="rounded-full bg-[#130E0E] hover:bg-[#130E0E]/90 text-white font-semibold px-12 py-7 text-lg shadow-2xl cursor-pointer group">
                        <Link href="/booking" className="flex items-center gap-2">
                            Book Your Appointment
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
        </main>
    );
}
