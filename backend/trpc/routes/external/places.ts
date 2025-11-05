import { z } from 'zod';
import { publicProcedure } from '../../create-context';

export const searchPlacesProcedure = publicProcedure
  .input(z.object({ query: z.string(), lat: z.number().optional(), lng: z.number().optional() }))
  .query(async ({ input }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return { provider: 'Google Places', items: [], mode: 'simulation' as const };
    }
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
      url.searchParams.set('query', input.query);
      if (input.lat && input.lng) {
        url.searchParams.set('location', `${input.lat},${input.lng}`);
        url.searchParams.set('radius', '5000');
      }
      url.searchParams.set('key', apiKey);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Google Places error');
      const json = await res.json();
      return { provider: 'Google Places', items: json?.results ?? [], mode: 'live' as const };
    } catch (e) {
      console.error('[places] search error', e);
      return { provider: 'Google Places', items: [], mode: 'simulation' as const };
    }
  });
