export interface ServiceItem {
    name: string;
    price: string;
    durationMinutes: number; // 0 = add-on (done during main service)
}

export interface ServiceCategory {
    category: string;
    description: string;
    items: ServiceItem[];
}

export interface BookableService {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

// ── Services Page Data ──────────────────────────────────────────────
export const services: ServiceCategory[] = [
    {
        category: "Acrylic",
        description: "Long-lasting, durable extensions with flawless finish",
        items: [
            { name: "Acrylic Tips (Plain)", price: "R300", durationMinutes: 120 },
            { name: "Acrylic Refill", price: "R250", durationMinutes: 120 },
            { name: "Acrylic Overlay", price: "R250", durationMinutes: 120 },
            { name: "Acrylic Toes", price: "R200", durationMinutes: 60 },
        ]
    },
    {
        category: "Gel & Rubber Base",
        description: "Flexible, natural-looking enhancements",
        items: [
            { name: "Rubber Base", price: "R300", durationMinutes: 90 },
            { name: "Rubber Base Refill", price: "R250", durationMinutes: 90 },
            { name: "Structured Gel", price: "R250", durationMinutes: 90 },
            { name: "Unstructured Gel", price: "R200", durationMinutes: 60 },
        ]
    },
    {
        category: "Gel Tips",
        description: "Seamless gel tip extensions for a natural look",
        items: [
            { name: "Gel Tips (Plain)", price: "R300", durationMinutes: 120 },
        ]
    },
    {
        category: "Toes",
        description: "Pamper your feet with our luxury pedicure services",
        items: [
            { name: "Gel Toes", price: "R200", durationMinutes: 60 },
            { name: "Acrylic Toes", price: "R200", durationMinutes: 60 },
        ]
    },
    {
        category: "Nail Art & Extras",
        description: "Custom designs to express your unique style",
        items: [
            { name: "Nail Art (Foil, Chrome, Glitter)", price: "From R15", durationMinutes: 0 },
            { name: "Full Stones", price: "R100", durationMinutes: 0 },
            { name: "Charms / Bows", price: "R10 each", durationMinutes: 0 },
            { name: "Extra Length", price: "R50", durationMinutes: 0 },
            { name: "Soak Off", price: "R50", durationMinutes: 45 },
            { name: "Repair", price: "R20", durationMinutes: 0 },
        ]
    }
];

// ── Booking Page Data ───────────────────────────────────────────────
export const bookableServices: BookableService[] = [
    { id: "acrylic-new", name: "Acrylic Tips (Plain)", price: 300, durationMinutes: 120 },
    { id: "acrylic-refill", name: "Acrylic Refill", price: 250, durationMinutes: 120 },
    { id: "acrylic-overlay", name: "Acrylic Overlay", price: 250, durationMinutes: 120 },
    { id: "acrylic-toes", name: "Acrylic Toes", price: 200, durationMinutes: 60 },
    { id: "rubber-base", name: "Rubber Base", price: 300, durationMinutes: 90 },
    { id: "rubber-base-refill", name: "Rubber Base Refill", price: 250, durationMinutes: 90 },
    { id: "gel-tips", name: "Gel Tips (Plain)", price: 300, durationMinutes: 120 },
    { id: "structured-gel", name: "Structured Gel", price: 250, durationMinutes: 90 },
    { id: "unstructured-gel", name: "Unstructured Gel", price: 200, durationMinutes: 60 },
    { id: "gel-toes", name: "Gel Toes", price: 200, durationMinutes: 60 },
    { id: "soak-off", name: "Soak Off (Hands)", price: 50, durationMinutes: 45 },
    { id: "nail-art", name: "Nail Art Add-on", price: 50, durationMinutes: 0 },
];

// ── Time Slots (half-hourly, 7am–3:30pm) ──────────────────────────
export const TIME_SLOTS = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
];

// ── Helpers ─────────────────────────────────────────────────────────

/** Format minutes to a human-readable duration string */
export function formatDuration(minutes: number): string {
    if (minutes === 0) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

/** Round minutes UP to the nearest 30-minute increment, then subtract 1 for "secret" 29-min slots */
export function roundUpTo30(minutes: number): number {
    if (minutes === 0) return 0;
    return (Math.ceil(minutes / 30) * 30) - 1;
}

/** Parse "HH:MM" to minutes since midnight */
export function timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}

/**
 * Given existing bookings with their durations and a set of time slots,
 * determine which slots are blocked.
 */
export function getBlockedSlots(
    existingBookings: { time: string; durationMinutes: number }[],
    allSlots: string[]
): Set<string> {
    const blocked = new Set<string>();

    for (const booking of existingBookings) {
        const startMin = timeToMinutes(booking.time);
        const durationRounded = roundUpTo30(booking.durationMinutes || 60);
        const endMin = startMin + durationRounded;

        for (const slot of allSlots) {
            const slotMin = timeToMinutes(slot);
            if (slotMin >= startMin && slotMin < endMin) {
                blocked.add(slot);
            }
        }
    }

    return blocked;
}

/**
 * Check if a prospective booking at `startTime` with `durationMinutes`
 * would conflict with any existing bookings.
 */
export function wouldConflict(
    startTime: string,
    durationMinutes: number,
    existingBookings: { time: string; durationMinutes: number }[],
): boolean {
    const newStart = timeToMinutes(startTime);
    const newEnd = newStart + roundUpTo30(durationMinutes || 60);

    for (const booking of existingBookings) {
        const existStart = timeToMinutes(booking.time);
        const existEnd = existStart + roundUpTo30(booking.durationMinutes || 60);

        if (newStart < existEnd && existStart < newEnd) {
            return true;
        }
    }

    return false;
}
