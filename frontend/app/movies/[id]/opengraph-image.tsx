import { ImageResponse } from 'next/og';
import { getMovieDetails } from '@/services/movieService';

export const runtime = 'edge';

export const alt = 'Neocinema Movies';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie: any = null;
  try {
    movie = await getMovieDetails(id, 'movie');
  } catch (e) {
    console.error('OG image fetch error:', e);
  }

  const title = movie?.title || 'Neocinema Movie Discovery';
  const releaseYear = movie?.releaseDate && !isNaN(new Date(movie.releaseDate).getTime())
    ? new Date(movie.releaseDate).getFullYear()
    : null;
  const rating = movie?.rating ? movie.rating.toFixed(1) : null;
  const genres = (movie?.genres || []).slice(0, 3).join(' • ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 36, fontWeight: 900 }}>
            <span style={{ color: '#dc2626' }}>NEO</span>CINEMA
          </div>
          <div
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: '2px',
            }}
          >
            FREE HD MOVIE
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {rating && (
              <div style={{ color: '#eab308', fontSize: 24, fontWeight: 800 }}>
                ★ {rating} / 10
              </div>
            )}
            {releaseYear && (
              <div style={{ color: '#a1a1aa', fontSize: 24, fontWeight: 700 }}>
                {releaseYear}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              maxHeight: '140px',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {genres && (
            <div style={{ fontSize: 24, color: '#a1a1aa', fontWeight: 600 }}>
              {genres}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #27272a',
            paddingTop: '24px',
            color: '#71717a',
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <div>Watch Free in HD — No Registration</div>
          <div>www.neocinematv.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
