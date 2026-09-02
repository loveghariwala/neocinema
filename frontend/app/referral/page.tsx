import { Metadata } from "next";
import ReferralClient from "./ReferralClient";

interface PageProps {
    searchParams: Promise<{
        ref?: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    return {
        title: "Claim Your Neocinema Invite Pass | Neocinema Referral",
        description: "Join Neocinema using a referral code and unlock premium movie & series streaming features.",
        alternates: {
            canonical: `${baseUrl}/referral`,
        },
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            title: "Claim Your Neocinema Invite Pass",
            description: "Unlock premium movie & series streaming features on Neocinema.",
            type: "website",
            images: [{ url: "/og_banner.png", width: 1200, height: 630, alt: "Neocinema Referral Invite" }],
        },
        twitter: {
            card: "summary_large_image",
            title: "Claim Your Neocinema Invite Pass",
            description: "Unlock premium movie & series streaming features on Neocinema.",
            images: ["/og_banner.png"],
        }
    };
}

export default function ReferralPage() {
    return <ReferralClient />;
}
