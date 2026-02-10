import Link from "next/link";
import { Instagram, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#130E0E] text-[#B6AFAE] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl gradient-rose flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-[#130E0E]" />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold text-white">Hazelnailz</h3>
                                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#DFC6C8]">x Ikonique</span>
                            </div>
                        </div>
                        <p className="text-[#B6AFAE] max-w-md leading-relaxed mb-6">
                            Experience premium nail care where luxury meets precision.
                            Dedicated to providing the highest quality acrylics, gels, and nail art in a serene environment.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-[#B6AFAE] hover:text-[#DFC6C8] hover:border-[#DFC6C8]/50 transition-all cursor-pointer"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:bookings@hazelnailz.co.za"
                                className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-[#B6AFAE] hover:text-[#DFC6C8] hover:border-[#DFC6C8]/50 transition-all cursor-pointer"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Explore</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Services & Pricing", href: "/services" },
                                { name: "Portfolio", href: "/gallery" },
                                { name: "Book Appointment", href: "/booking" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Get in Touch</h4>
                        <div className="space-y-4">
                            <a
                                href="mailto:bookings@hazelnailz.co.za"
                                className="flex items-center gap-3 text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                            >
                                <Mail className="w-4 h-4 text-[#DFC6C8]" />
                                <span className="text-sm">bookings@hazelnailz.co.za</span>
                            </a>
                            <a
                                href="tel:+27123456789"
                                className="flex items-center gap-3 text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                            >
                                <Phone className="w-4 h-4 text-[#DFC6C8]" />
                                <span className="text-sm">+27 12 345 6789</span>
                            </a>
                            <div className="flex items-start gap-3 text-[#B6AFAE]">
                                <MapPin className="w-4 h-4 text-[#DFC6C8] mt-0.5" />
                                <span className="text-sm">Johannesburg, South Africa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#2A2222]">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[#B6AFAE]/60">
                        &copy; {new Date().getFullYear()} Hazelnailz x IKONIQUE. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-[#B6AFAE]/60">
                        <Link href="#" className="hover:text-[#B6AFAE] transition-colors cursor-pointer">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#B6AFAE] transition-colors cursor-pointer">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
