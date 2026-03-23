"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { isUserAdmin } from "@/lib/admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { isLoaded, user } = useUser();

    if (isLoaded && !isUserAdmin(user)) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#FAF8F8] flex">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64 transition-all duration-500 overflow-x-hidden pt-20 lg:pt-0">
                <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
