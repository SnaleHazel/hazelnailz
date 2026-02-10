"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
    const phoneNumber = "27123456789"; // Replace with actual number
    const message = "Hi Hazelnailz, I would like to enquire about a booking.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg shadow-green-500/30 group"
            aria-label="Contact on WhatsApp"
            style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            }}
        >
            <MessageCircle className="w-7 h-7 text-white" />

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25"></span>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#130E0E] text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}
