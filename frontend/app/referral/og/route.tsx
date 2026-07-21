import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const refCode = searchParams.get("ref") || "VIP";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.neocinematv.com";
    const hostName = new URL(baseUrl).hostname.toUpperCase();

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#030303",
                    position: "relative",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Glowing Aura Spheres */}
                <div
                    style={{
                        position: "absolute",
                        left: "-100px",
                        top: "-100px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "rgba(220, 38, 38, 0.15)",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: "-100px",
                        bottom: "-100px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "rgba(220, 38, 38, 0.10)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Decorative border container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "90%",
                        height: "85%",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "32px",
                        padding: "40px",
                        backgroundColor: "rgba(255, 255, 255, 0.01)",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                backgroundColor: "rgba(220, 38, 38, 0.15)",
                                border: "1px solid rgba(220, 38, 38, 0.3)",
                                borderRadius: "12px",
                                padding: "8px 16px",
                                color: "#ef4444",
                                fontSize: "14px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                            }}
                        >
                            🎁 VIP INVITE PASS
                        </div>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: "48px",
                            fontWeight: 900,
                            color: "#ffffff",
                            textAlign: "center",
                            marginBottom: "16px",
                            letterSpacing: "-2px",
                            lineHeight: 1.1,
                        }}
                    >
                        Stream HD Free on Neocinema
                    </div>

                    {/* Description */}
                    <div
                        style={{
                            fontSize: "20px",
                            color: "#a3a3a3",
                            textAlign: "center",
                            marginBottom: "40px",
                            maxWidth: "700px",
                            lineHeight: 1.4,
                        }}
                    >
                        Your friend invited you to watch 10,000+ movies & TV series with zero redirect ads, premium playback pipelines, and AI recommendation matching.
                    </div>

                    {/* Code Container */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            padding: "16px 32px",
                            borderRadius: "20px",
                        }}
                    >
                        <span style={{ fontSize: "16px", color: "#737373", textTransform: "uppercase", fontWeight: "bold" }}>
                            Referral Code:
                        </span>
                        <span
                            style={{
                                fontSize: "28px",
                                color: "#ef4444",
                                fontWeight: "900",
                                letterSpacing: "1px",
                            }}
                        >
                            {refCode}
                        </span>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "40px",
                            fontSize: "12px",
                            color: "#525252",
                            textTransform: "uppercase",
                            letterSpacing: "4px",
                            fontWeight: "bold",
                        }}
                    >
                        {hostName} • AI-POWERED STREAMING
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
