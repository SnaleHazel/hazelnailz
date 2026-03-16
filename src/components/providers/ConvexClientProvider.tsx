"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

// Check if credentials are configured
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const isConfigured = !!publishableKey && !!convexUrl && !convexUrl.includes("placeholder");

// Use a valid format dummy URL if not configured to prevent fatal parser errors
const dummyUrl = "https://happy-monkey-123.convex.cloud";
const convex = new ConvexReactClient(isConfigured ? convexUrl! : dummyUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!isConfigured) {
        console.warn("Convex is using a dummy URL. Please run `npx convex dev` to set up your real database.");
    }

    return (
        <ClerkProvider publishableKey={publishableKey!}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
