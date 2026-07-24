import { ImageResponse } from 'next/og';
import { getMovieDetails } from '@/services/movieService';

export const runtime = 'edge';

export const alt = 'Neocinema TV Series Discovery';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let series: any = null;
  try {
    series = await getMovieDetails(id, 'tv');
  } catch (e) {
    console.error('OG image fetch error:', e);
  }

  if (!series) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#09090b',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: 48,
            fontWeight: 'bold',
          }}
        >
          Neocinema — TV Series Discovery
        </div>
      ),
      { ...size }
    );
  }

  const backdropUrl = series.backdropPath
    ? `https://image.tmdb.org/t/p/w1280${series.backdropPath}`
    : series.posterPath
    ? `https://image.tmdb.org/t/p/w500${series.posterPath}`
    : null;

  const releaseYear = series.releaseDate && !isNaN(new Date(series.releaseDate).getTime())
    ? new Date(series.releaseDate).getFullYear()
    : null;
  const rating = series.rating ? series.rating.toFixed(1) : null;
  const genres = (series.genres || []).slice(0, 3).join(' • ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          backgroundColor: '#09090b',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {backdropUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backdropUrl}
            alt={series.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.45,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.65) 50%, rgba(9,9,11,0.2) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              TV SERIES HD
            </div>
            {rating && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#eab308',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: 16,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ★ {rating} / 10
              </div>
            )}
            {releaseYear && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#a1a1aa',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {releaseYear}
              </div>
            )}
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              margin: '0 0 16px 0',
              color: '#ffffff',
              maxHeight: '140px',
              overflow: 'hidden',
            }}
          >
            {series.title}
          </h1>

          {genres && (
            <p
              style={{
                fontSize: 22,
                color: '#a1a1aa',
                margin: '0 0 24px 0',
                fontWeight: 600,
              }}
            >
              {genres}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              paddingTop: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 24, fontWeight: 900 }}>
              <span style={{ color: '#2563eb' }}>NEO</span>CINEMA
            </div>
            <div style={{ fontSize: 18, color: '#71717a', fontWeight: 600 }}>
              www.neocinematv.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
