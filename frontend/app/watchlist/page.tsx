import { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
    title: "Watchlist — NeoCinema",
    description:
        "Your personal watchlist. Save movies and series to watch later.",
};

export default function WatchlistPage() {
    return <WatchlistClient />;
}
