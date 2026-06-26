import Script from "next/script";

export default function MonetagAds() {
    return (
        <>
            {/* ==========================================
                MONETAG ADS
                ========================================== */}
                
            {/* Monetag Vignette Banner */}
            <Script src="https://n6wxm.com/vignette.min.js" data-zone="11203115" data-cfasync="false" strategy="lazyOnload" />

            {/* Monetag In-Page Push */}
            <Script src="https://nap5k.com/tag.min.js" data-zone="11203118" data-cfasync="false" strategy="lazyOnload" />
        </>
    );
}
