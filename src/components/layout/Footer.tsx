import Link from "next/link";
import { Instagram, Mail, Phone, MapPin, Sparkles, MessageCircle } from "lucide-react";

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
                        <Link href="/" className="inline-block mb-6 group">
                            <h3 className="font-serif text-3xl font-bold text-white transition-all group-hover:scale-[1.01]">Hazelnailz</h3>
                            <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#DFC6C8] -mt-1 block">x Ikonique</span>
                        </Link>
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
                                href="tel:+27754462264"
                                className="flex items-center gap-3 text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                            >
                                <Phone className="w-4 h-4 text-[#DFC6C8]" />
                                <span className="text-sm">+27 75 446 2264</span>
                            </a>
                            <a
                                href="https://wa.me/27754462264?text=Hi%20Hazelnailz%2C%20I%20would%20like%20to%20enquire%20about%20a%20booking."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 text-[#DFC6C8]" />
                                <span className="text-sm">WhatsApp Chat</span>
                            </a>
                            <a
                                href="https://maps.google.com/?q=10+Lawson+Place+Queensburgh+KwaZulu-Natal+4093+South+Africa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 text-[#B6AFAE] hover:text-[#DFC6C8] transition-colors cursor-pointer"
                            >
                                <MapPin className="w-4 h-4 text-[#DFC6C8] mt-0.5" />
                                <span className="text-sm">10 Lawson Place, Queensburgh,<br />KwaZulu-Natal, 4093</span>
                            </a>
                            <div className="mt-6">
                                <h5 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Business Hours</h5>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Tuesday - Sunday</span>
                                        <span className="text-[#DFC6C8]">07:00 - 17:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Monday</span>
                                        <span className="text-[#DFC6C8]">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed */}
                <div className="mt-12">
                    <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Visit Us</h3>
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-[#2A2222]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3459.4967099966684!2d30.91658887480282!3d-29.87878522361287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ef7aa97d3641965%3A0xb4aaa165a5690039!2s10%20Lawson%20Pl%2C%20Malvern%2C%20Queensburgh%2C%204055!5e0!3m2!1sen!2sza!4v1770856263911!5m2!1sen!2sza"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Hazelnailz Location - 10 Lawson Place, Queensburgh"
                        ></iframe>
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
