import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base') || 'USD';

  try {
    // We use Next.js fetch caching to update the rate every 3600 seconds (1 hour)
    // This prevents API rate limits and makes the dashboard load instantly
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`, {
      next: { revalidate: 3600 } 
    });
    
    const data = await res.json();

    if (data && data.rates && data.rates.KES) {
      return NextResponse.json({ rate: data.rates.KES });
    }
    
    return NextResponse.json({ error: 'Rate not found' }, { status: 404 });
  } catch (error) {
    console.error('Exchange Rate API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exchange rate' }, { status: 500 });
  }
}