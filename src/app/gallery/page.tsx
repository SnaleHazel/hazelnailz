"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "@/lib/lightbox.css";
import { ArrowRight, ZoomIn } from "lucide-react";

// Gallery images with bento grid sizing
const photos = [
    { src: "/images/1773975778655.jpg", span: "col-span-2 row-span-2" },
    { src: "/images/1773975778682.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778704.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778727.jpg", span: "col-span-1 row-span-2" },
    { src: "/images/1773975778751.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778776.jpg", span: "col-span-2 row-span-1" },
    { src: "/images/1773975778800.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778824.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778849.jpg", span: "col-span-2 row-span-2" },
    { src: "/images/1773975778874.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778899.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778922.jpg", span: "col-span-1 row-span-2" },
    { src: "/images/1773975778943.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975778964.jpg", span: "col-span-2 row-span-1" },
    { src: "/images/1773975778987.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779020.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779053.jpg", span: "col-span-2 row-span-2" },
    { src: "/images/1773975779076.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779101.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779124.jpg", span: "col-span-1 row-span-2" },
    { src: "/images/1773975779149.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779173.jpg", span: "col-span-2 row-span-1" },
    { src: "/images/1773975779198.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779224.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779248.jpg", span: "col-span-2 row-span-2" },
    { src: "/images/1773975779271.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779293.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779316.jpg", span: "col-span-1 row-span-2" },
    { src: "/images/1773975779340.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779365.jpg", span: "col-span-2 row-span-1" },
    { src: "/images/1773975779387.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779411.jpg", span: "col-span-1 row-span-1" },
    { src: "/images/1773975779435.jpg", span: "col-span-2 row-span-2" },
    { src: "/images/1773975779459.jpg", span: "col-span-1 row-span-1" },
];

const categories = ["All", "Acrylic", "Gel", "Nail Art"];

export default function Gallery() {
    const [index, setIndex] = useState(-1);
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <main className="min-h-screen bg-[#FAF8F8]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[#130E0E]"></div>
                <div className="absolute inset-0 bg-[url('/images/1773975779198.jpg')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#130E0E]/50 to-[#130E0E]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="mb-6">
                        <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wider uppercase">Our Work</span>
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
                    <div className="mb-6">
                        <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wider uppercase">Our Work</span>
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
