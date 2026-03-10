"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Home page has a light background -> Dark text initially
    // Other pages have dark backgrounds -> Light text initially
    const isHomePage = pathname === "/";
    const isDarkBackground = !isHomePage;

    // Text should be dark if:
    // 1. We are scrolled (glass background is light/white-ish)
    // 2. OR we are on the Home page (light background)
    const useDarkText = isScrolled || isHomePage;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed z-50 transition-all duration-500 ease-out",
                isScrolled
                    ? "top-4 left-4 right-4 glass rounded-2xl shadow-lg py-3 px-6"
                    : "top-0 left-0 right-0 bg-transparent py-6 px-4"
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 text-[#130E0E]" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-serif text-xl font-bold tracking-tight transition-colors",
                            useDarkText ? "text-[#130E0E]" : "text-white"
                        )}>
                            Hazelnailz
                        </span>
                        <span className={cn(
                            "text-[10px] font-medium tracking-[0.2em] uppercase -mt-1 transition-colors",
                            useDarkText ? "text-[#9D8587]" : "text-[#DFC6C8]"
                        )}>
                            x Ikonique
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer",
                                useDarkText
                                    ? "text-[#130E0E]/70 hover:text-[#130E0E] hover:bg-[#D7C2C2]/30"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex items-center gap-2 ml-4">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <Button variant="ghost" className={cn(
                                    "rounded-full font-medium transition-all",
                                    useDarkText ? "text-[#130E0E]" : "text-white"
                                )}>
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button className="rounded-full gradient-rose text-[#130E0E] font-semibold px-6 hover-glow border-0">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                            <UserButton />
                        </Show>
                    </div>

                    <Button
                        asChild
                        className="ml-2 rounded-full border border-[#DFC6C8]/30 bg-transparent text-[#DFC6C8] hover:bg-[#DFC6C8]/10 font-semibold px-6 cursor-pointer hidden lg:flex"
                    >
                        <Link href="/booking">Book Now</Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={cn(
                        "md:hidden p-2 rounded-lg transition-colors cursor-pointer",
                        useDarkText
                            ? "text-[#130E0E] hover:bg-[#D7C2C2]/30"
                            : "text-white hover:bg-white/10"
                    )}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute left-0 right-0 top-full mt-2 mx-4 glass rounded-2xl shadow-xl overflow-hidden transition-all duration-300",
                isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="p-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[#130E0E]/70 hover:text-[#130E0E] py-3 px-4 rounded-xl hover:bg-[#D7C2C2]/30 transition-colors font-medium cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#D7C2C2]/30">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <Button variant="outline" className="w-full rounded-xl border-[#130E0E]/20 text-[#130E0E] py-6">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button className="w-full rounded-xl gradient-rose text-[#130E0E] font-semibold py-6">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#D7C2C2]/10 rounded-xl">
                                <span className="text-sm font-medium text-[#130E0E]/70">Account</span>
                                <UserButton />
                            </div>
                        </Show>
                    </div>

                    <Button
                        asChild
                        className="w-full mt-2 rounded-xl border border-[#130E0E]/10 bg-transparent text-[#130E0E] font-semibold py-6 cursor-pointer"
                    >
                        <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                            Book Appointment
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
