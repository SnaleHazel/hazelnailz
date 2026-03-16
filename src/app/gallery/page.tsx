"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "@/lib/lightbox.css";
import { Camera, ArrowRight, Sparkles, ZoomIn } from "lucide-react";

// Gallery images with bento grid sizing
const photos = [
    { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=60", span: "col-span-2 row-span-2" },
    { src: "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-2" },
    { src: "https://images.unsplash.com/photo-1599694726588-306c59b20756?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1596462502278-27bfdd403322?w=800&auto=format&fit=crop&q=60", span: "col-span-2 row-span-1" },
    { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60", span: "col-span-1 row-span-1" },
];

const categories = ["All", "Acrylic", "Gel", "Nail Art", "Toes"];

export default function Gallery() {
    const [index, setIndex] = useState(-1);
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <main className="min-h-screen bg-[#FAF8F8]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#130E0E]"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#130E0E]/50 to-[#130E0E]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-6">
                        <Camera className="w-4 h-4 text-[#DFC6C8]" />
                        <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">Our Work</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">
                        <span className="text-gradient-rose">Portfolio</span>
                    </h1>
                    <p className="text-lg text-[#B6AFAE] max-w-2xl mx-auto">
                        Browse our latest creations. From minimalist elegance to bold statements.
                    </p>

                    {/* Filter Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat
                                        ? "gradient-rose text-[#130E0E] shadow-lg shadow-[#DFC6C8]/25 scale-105"
                                        : "glass-dark text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Grid Gallery */}
            <section className="py-16 container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                    {photos.map((photo, i) => (
                        <div
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`${photo.span} group relative rounded-2xl overflow-hidden cursor-pointer hover-lift`}
                        >
                            {/* Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${photo.src})` }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#130E0E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Glass border effect */}
                            <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#DFC6C8]/30 transition-colors" />

                            {/* Zoom icon */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-12 rounded-full glass-dark flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-[#DFC6C8]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Lightbox
                    slides={photos.map(p => ({ src: p.src }))}
                    open={index >= 0}
                    index={index}
                    close={() => setIndex(-1)}
                />
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#130E0E] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>
                <div className="absolute inset-0 pattern-dots opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-[#DFC6C8]" />
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Love What You See?
                    </h2>
                    <p className="text-lg text-[#B6AFAE] max-w-xl mx-auto mb-10">
                        Turn your inspiration into reality. Book your appointment today.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full gradient-rose text-[#130E0E] font-semibold px-10 py-7 text-lg hover-glow cursor-pointer group"
                    >
                        <Link href="/booking" className="flex items-center gap-2">
                            Book This Look
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
