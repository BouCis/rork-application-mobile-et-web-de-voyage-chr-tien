import { z } from 'zod';
import { publicProcedure } from '../../create-context';

async function getAmadeusToken() {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;
  if (!key || !secret) return null;
  try {
    const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(key)}&client_secret=${encodeURIComponent(secret)}`,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token: string; expires_in: number };
    return json.access_token;
  } catch (e) {
    console.error('[amadeus] token error', e);
    return null;
  }
}

export const searchCityOrAirportProcedure = publicProcedure
  .input(z.object({ keyword: z.string().min(2), subType: z.enum(['CITY', 'AIRPORT', 'ANY']).optional() }))
  .query(async ({ input }) => {
    const token = await getAmadeusToken();
    if (!token) {
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
    try {
      const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations');
      const subType = input.subType && input.subType !== 'ANY' ? input.subType : 'CITY,AIRPORT';
      url.searchParams.set('subType', subType);
      url.searchParams.set('keyword', input.keyword);
      url.searchParams.set('page[limit]', '10');
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Amadeus locations error');
      const json = await res.json();
      return { provider: 'Amadeus', items: json?.data ?? [], mode: 'live' as const };
    } catch (e) {
      console.error('[amadeus] locations error', e);
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
  });

export const searchFlightsProcedure = publicProcedure
  .input(z.object({ origin: z.string(), destination: z.string(), departureDate: z.string() }))
  .query(async ({ input }) => {
    const token = await getAmadeusToken();
    if (!token) {
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
    try {
      const url = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
      url.searchParams.set('originLocationCode', input.origin);
      url.searchParams.set('destinationLocationCode', input.destination);
      url.searchParams.set('departureDate', input.departureDate);
      url.searchParams.set('adults', '1');
      url.searchParams.set('currencyCode', 'EUR');
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Amadeus flights error');
      const json = await res.json();
      return { provider: 'Amadeus', items: json?.data ?? [], mode: 'live' as const };
    } catch (e) {
      console.error('[amadeus] flights error', e);
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
  });

export const searchHotelsProcedure = publicProcedure
  .input(z.object({ cityCode: z.string() }))
  .query(async ({ input }) => {
    const token = await getAmadeusToken();
    if (!token) {
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
    try {
      const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city');
      url.searchParams.set('cityCode', input.cityCode);
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Amadeus hotels error');
      const json = await res.json();
      return { provider: 'Amadeus', items: json?.data ?? [], mode: 'live' as const };
    } catch (e) {
      console.error('[amadeus] hotels error', e);
      return { provider: 'Amadeus', items: [], mode: 'simulation' as const };
    }
  });
