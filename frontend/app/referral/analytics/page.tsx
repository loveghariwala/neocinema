import { Metadata } from "next";
import ReferralAnalyticsClient from "./ReferralAnalyticsClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";

export const metadata: Metadata = {
    title: "Referral & Growth Analytics | Neocinema",
    description: "Track the viral coefficient loop (K-Factor) and search visibility performance in real-time.",
    alternates: {
        canonical: `${baseUrl}/referral/analytics`,
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function ReferralAnalyticsPage() {
    return <ReferralAnalyticsClient />;
}
