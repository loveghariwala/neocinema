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
        title: `Invite Pass from ${refCode} | NetMirrors`,
        description: `Join NetMirrors using referral code ${refCode} and unlock premium movie & series streaming features.`,
        openGraph: {
            title: `Claim Your NetMirrors Invite Pass (${refCode})`,
            description: `Unlock premium movie & series streaming features on NetMirrors.`,
            type: "website",
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `NetMirrors Referral Invite Code: ${refCode}` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `Claim Your NetMirrors Invite Pass (${refCode})`,
            description: `Unlock premium movie & series streaming features on NetMirrors.`,
            images: [ogImageUrl],
        }
    };
}

export default function ReferralPage() {
    return <ReferralClient />;
}
