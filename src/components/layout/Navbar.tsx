"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { isUserAdmin } from "@/lib/admin";
import { LayoutDashboard } from "lucide-react";

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

    const { user } = useUser();
    const isAdmin = isUserAdmin(user);

    const AdminLink = () => {
        if (!isAdmin) return null;
        return (
            <Link 
                href="/admin" 
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                    useDarkText 
                        ? "bg-[#130E0E] text-white hover:bg-black" 
                        : "bg-white text-[#130E0E] hover:bg-[#DFC6C8]"
                )}
            >
                <LayoutDashboard className="w-3 h-3" />
                Admin
            </Link>
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                className={cn(
                    "fixed z-50 transition-all duration-500 ease-out",
                    isScrolled
                        ? "top-4 left-4 right-4 glass rounded-2xl shadow-lg py-3 px-6"
                        : "top-0 left-0 right-0 bg-transparent py-6 px-4"
                )}
            >
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/" className="group flex flex-col">
                        <span className={cn(
                            "font-serif text-2xl font-bold tracking-tight transition-all duration-300 group-hover:scale-[1.02]",
                            useDarkText ? "text-[#130E0E]" : "text-white"
                        )}>
                            Hazelnailz
                        </span>
                        <span className={cn(
                            "text-[10px] font-medium tracking-[0.4em] uppercase -mt-1 transition-colors",
                            useDarkText ? "text-[#9D8587]" : "text-[#DFC6C8]"
                        )}>
                            x Ikonique
                        </span>
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
                                <AdminLink />
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Link label="My Profile" labelIcon={<LayoutDashboard className="w-4 h-4" />} href="/profile" />
                                    </UserButton.MenuItems>
                                </UserButton>
                            </Show>
                        </div>

                        <Button
                            asChild
                            className="ml-2 rounded-full gradient-rose text-[#130E0E] font-semibold px-6 hover-glow border-0 hidden lg:flex"
                        >
                            <Link href="/booking">Book Now</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={cn(
                            "md:hidden p-2 rounded-lg transition-all duration-300 cursor-pointer relative z-[100]",
                            isMobileMenuOpen
                                ? "text-[#130E0E] hover:bg-[#130E0E]/5"
                                : useDarkText
                                    ? "text-[#130E0E] hover:bg-[#D7C2C2]/30"
                                    : "text-white hover:bg-white/10"
                        )}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay — rendered OUTSIDE <nav> so it's not clipped */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[90] bg-[#FAF8F8] backdrop-blur-xl md:hidden overflow-hidden"
                        style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-[#DFC6C8]/20 blur-[120px] rounded-full" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-[#DFC6C8]/15 blur-[120px] rounded-full" />
                        </div>

                        {/* Close button */}
                        <div className="absolute top-6 right-4 z-[100]">
                            <button
                                className="p-2 rounded-lg text-[#130E0E] hover:bg-[#130E0E]/5 transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative h-full flex flex-col items-center justify-center p-8">
                            <motion.div 
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                                    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                }}
                                className="flex flex-col items-center gap-8 w-full max-w-sm"
                            >
                                {navLinks.map((link) => (
                                    <motion.div
                                        key={link.name}
                                        variants={{
                                            open: { opacity: 1, y: 0 },
                                            closed: { opacity: 0, y: 20 }
                                        }}
                                        className="w-full"
                                    >
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "block text-center text-4xl font-serif font-bold transition-all duration-300 py-2",
                                                pathname === link.href ? "text-[#130E0E]" : "text-[#130E0E]/40 hover:text-[#130E0E]"
                                            )}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    variants={{
                                        open: { opacity: 1, y: 0 },
                                        closed: { opacity: 0, y: 20 }
                                    }}
                                    className="w-full pt-8 flex flex-col gap-4"
                                >
                                    <Show when="signed-out">
                                        <div className="grid grid-cols-2 gap-4">
                                            <SignInButton mode="modal">
                                                <Button variant="outline" className="rounded-full border-[#130E0E]/10 text-[#130E0E] py-7 text-lg">
                                                    Sign In
                                                </Button>
                                            </SignInButton>
                                            <SignUpButton mode="modal">
                                                <Button className="rounded-full gradient-rose text-[#130E0E] font-semibold py-7 text-lg border-0 shadow-lg shadow-[#DFC6C8]/40">
                                                    Sign Up
                                                </Button>
                                            </SignUpButton>
                                        </div>
                                    </Show>

                                    <Show when="signed-in">
                                        <div className="flex flex-col items-center gap-4 p-6 bg-[#130E0E]/5 rounded-3xl border border-[#130E0E]/5">
                                            <span className="text-sm font-medium text-[#130E0E]/60 uppercase tracking-widest">Your Account</span>
                                            <div className="flex items-center gap-4">
                                                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-16 h-16" } }} />
                                                {isAdmin && (
                                                    <Link 
                                                        href="/admin" 
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex flex-col items-center gap-1 group"
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-[#130E0E] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                                                            <LayoutDashboard className="w-8 h-8" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">Admin</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </Show>

                                    <Button
                                        asChild
                                        className="w-full mt-4 rounded-full bg-[#130E0E] text-white py-8 text-xl font-semibold shadow-2xl shadow-[#130E0E]/30"
                                    >
                                        <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3">
                                            Book Appointment
                                            <ArrowRight className="w-6 h-6" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            </motion.div>

                            {/* Footer hint */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-12 left-0 w-full text-center"
                            >
                                <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-[#130E0E]/20">
                                    Hazelnailz x Ikonique
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
