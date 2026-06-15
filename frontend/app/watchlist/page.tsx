import { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
    title: "Watchlist",
    description: "Your personal watchlist. Save movies and series to watch later.",
    alternates: { canonical: '/watchlist' },
    robots: { index: false, follow: false } // Watchlist is personal, shouldn't be indexed
};

export default function WatchlistPage() {
    return <WatchlistClient />;
}
