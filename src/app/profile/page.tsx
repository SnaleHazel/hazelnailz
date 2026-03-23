"use client";

import { UserProfile } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#FAF8F8]">
                {/* Hero */}
                <section className="relative h-[280px] gradient-premium overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-[#DFC6C8]/10 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] bg-[#DFC6C8]/5 blur-[100px] rounded-full" />
                    </div>
                    <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-4">
                                <span className="text-sm font-medium text-[#DFC6C8]/90 tracking-wide">Account</span>
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
                                Your Profile
                            </h1>
                            <p className="text-white/60 text-lg max-w-lg">
                                Manage your personal details, update your profile picture, and secure your account
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Profile Content */}
                <section className="container mx-auto px-6 -mt-8 relative z-20 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="glass rounded-3xl overflow-hidden shadow-xl"
                    >
                        <UserProfile
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    cardBox: "w-full max-w-none shadow-none border-0",
                                    card: "shadow-none border-0 bg-transparent",
                                    navbar: "border-r border-[#DFC6C8]/20 bg-[#FAF8F8]/50",
                                    navbarButton: "text-[#130E0E]/70 hover:text-[#130E0E] hover:bg-[#DFC6C8]/10 rounded-xl transition-all",
                                    navbarButtonActive: "bg-[#DFC6C8]/20 text-[#130E0E] font-bold",
                                    pageScrollBox: "p-8",
                                    page: "gap-8",
                                    profileSection: "gap-4",
                                    profileSectionTitle: "font-serif text-xl font-bold text-[#130E0E] border-b border-[#DFC6C8]/20 pb-4",
                                    profileSectionContent: "gap-4",
                                    profileSectionPrimaryButton: "gradient-rose text-[#130E0E] font-bold rounded-xl hover-glow border-0 shadow-md",
                                    formButtonPrimary: "gradient-rose text-[#130E0E] font-bold rounded-xl hover-glow border-0 shadow-md",
                                    formFieldInput: "rounded-xl border-[#DFC6C8]/30 focus:border-[#DFC6C8] focus:ring-[#DFC6C8]/30",
                                    avatarBox: "w-20 h-20 rounded-2xl",
                                    avatarImageActionsUpload: "gradient-rose text-[#130E0E] font-bold rounded-xl border-0",
                                    badge: "bg-[#DFC6C8]/20 text-[#130E0E] font-bold rounded-lg",
                                    headerTitle: "font-serif text-2xl font-bold text-[#130E0E]",
                                    headerSubtitle: "text-[#B6AFAE]",
                                }
                            }}
                        />
                    </motion.div>
                </section>
            </main>
            <Footer />
        </>
    );
}
