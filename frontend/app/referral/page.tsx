import { Metadata } from "next";
import ReferralClient from "./ReferralClient";

interface PageProps {
    searchParams: Promise<{
        ref?: string;
    }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const { ref } = await searchParams;
    const refCode = ref || "VIP";
    
    // Dynamic URL pointing to our edge ImageResponse generator
    const ogImageUrl = `/referral/og?ref=${encodeURIComponent(refCode)}`;

    return {
        title: `Invite Pass from ${refCode} | NeoCinema`,
        description: `Join NeoCinema using referral code ${refCode} and unlock premium ad-free movie & series streaming.`,
        openGraph: {
            title: `Claim Your NeoCinema Invite Pass (${refCode})`,
            description: `Unlock premium ad-free movie & series streaming on NeoCinema.`,
            type: "website",
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `NeoCinema Referral Invite Code: ${refCode}` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Claim Your NeoCinema Invite Pass (${refCode})`,
            description: `Unlock premium ad-free movie & series streaming on NeoCinema.`,
            images: [ogImageUrl],
        }
    };
}

export default function ReferralPage() {
    return <ReferralClient />;
}
