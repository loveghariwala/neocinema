import { Metadata } from "next";
import ReferralAnalyticsClient from "./ReferralAnalyticsClient";

export const metadata: Metadata = {
    title: "Referral & Growth Analytics | NetMirrors",
    description: "Track the viral coefficient loop (K-Factor) and search visibility performance in real-time.",
    alternates: {
        canonical: "/referral/analytics",
    },
};

export default function ReferralAnalyticsPage() {
    return <ReferralAnalyticsClient />;
}
