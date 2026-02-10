"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

// Check if credentials are configured
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const isConfigured = publishableKey && convexUrl && !publishableKey.includes("placeholder");

const convex = isConfigured ? new ConvexReactClient(convexUrl!) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    // If credentials aren't configured, render children directly without auth
    if (!isConfigured || !convex) {
        return <>{children}</>;
    }

    return (
        <ClerkProvider publishableKey={publishableKey!}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
