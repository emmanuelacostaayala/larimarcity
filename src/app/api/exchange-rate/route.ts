import { NextResponse } from 'next/server';

// Fetches the EUR→USD rate from the European Central Bank via Frankfurter API
// This endpoint acts as a proxy to avoid CORS issues in the browser
export async function GET() {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD', {
            next: { revalidate: 3600 } // cache for 1 hour
        });

        if (!res.ok) {
            throw new Error(`Frankfurter API error: ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json({
            rate: data.rates?.USD,
            date: data.date,
            base: 'EUR',
            target: 'USD'
        });
    } catch (error: any) {
        console.error('Exchange rate fetch error:', error.message);
        // Return a fallback rate if the API is unavailable
        return NextResponse.json({
            rate: 1.05,
            date: new Date().toISOString().split('T')[0],
            base: 'EUR',
            target: 'USD',
            fallback: true,
            error: 'Could not fetch live rate, using fallback'
        }, { status: 200 });
    }
}
