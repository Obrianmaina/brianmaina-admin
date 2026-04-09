import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Design & Technology Blog';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Pushes title to top and author to bottom
            backgroundColor: '#030712', 
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Primary Focus: Dynamic Article Title */}
          <div
            style={{
              color: 'white',
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Secondary Focus: Your Branding at the bottom */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ color: '#14b8a6', fontSize: 32, fontWeight: 'bold' }}>
              Brian Maina Nyawira
            </div>
            <div style={{ color: '#6b7280', fontSize: 32, marginLeft: '16px' }}>
              | Visual Designer
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    return new Response('Failed to generate image', { status: 500 });
  }
}