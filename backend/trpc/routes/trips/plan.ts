import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { locations, checklists, expenses } from '../../../db/schema';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const countriesData: Record<string, { name: string; cities: { name: string; lat: number; lng: number }[] }> = require('../../../../data/countries-cities.json');

function findCityLatLng(countryCodeOrName: string, cityName: string): { lat: number; lng: number } | null {
  // Try ISO2 key first
  const byIso = countriesData[countryCodeOrName as keyof typeof countriesData];
  const norm = (s: string) => s.toLowerCase();
  if (byIso) {
    const city = byIso.cities.find(c => norm(c.name) === norm(cityName));
    if (city) return { lat: city.lat, lng: city.lng };
  }
  // Fallback: search by country name
  for (const [, v] of Object.entries(countriesData)) {
    if (norm(v.name) === norm(countryCodeOrName)) {
      const city = v.cities.find(c => norm(c.name) === norm(cityName));
      if (city) return { lat: city.lat, lng: city.lng };
    }
  }
  return null;
}

export const planTripProcedure = publicProcedure
  .input(
    z.object({
      tripId: z.string(),
      userId: z.string(),
      originCountry: z.string().optional(),
      originCity: z.string().optional(),
      destinationCountry: z.string(),
      destinationCity: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      currency: z.string().default('EUR'),
    })
  )
  .mutation(async ({ input }) => {
    const { tripId, userId, destinationCountry, destinationCity, startDate, endDate, currency } = input;

    try {
      const mockFlightPrice = 150;
      const mockHotelPrice = 80;
      const mockMealPrice = 20;

      const coords = findCityLatLng(destinationCountry, destinationCity);

      const mockLocations = [
        {
          id: `loc_${Date.now()}_1`,
          tripId,
          name: `${destinationCity} Centre` ,
          latitude: coords?.lat ?? 0,
          longitude: coords?.lng ?? 0,
          address: `${destinationCity}, ${destinationCountry}`,
          country: destinationCountry,
          city: destinationCity,
          type: 'tourist' as const,
        },
        {
          id: `loc_${Date.now()}_2`,
          tripId,
          name: 'Point d\'intérêt',
          latitude: coords?.lat ?? 0,
          longitude: coords?.lng ?? 0,
          address: `${destinationCity}, ${destinationCountry}`,
          country: destinationCountry,
          city: destinationCity,
          type: 'historical' as const,
        },
      ];

      await db.insert(locations).values(mockLocations);

      const nowIso = new Date().toISOString();
      const mockChecklist = [
        {
          id: `chk_${Date.now()}_1`,
          tripId,
          userId,
          title: 'Passeport',
          description: 'Vérifier la validité (> 6 mois)',
          category: 'documents' as const,
          completed: false,
          dueDate: startDate,
          priority: 'high' as const,
          reminder: startDate,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
        {
          id: `chk_${Date.now()}_2`,
          tripId,
          userId,
          title: 'Vaccins',
          description: 'Vérifier les vaccins recommandés',
          category: 'health' as const,
          completed: false,
          dueDate: startDate,
          priority: 'medium' as const,
          reminder: startDate,
          createdAt: nowIso,
          updatedAt: nowIso,
        },
      ];

      await db.insert(checklists).values(mockChecklist);

      const mockExpenses = [
        {
          id: `exp_${Date.now()}_1`,
          tripId,
          userId,
          title: `Vol ${destinationCity}`,
          amount: mockFlightPrice,
          currency,
          category: 'transport' as const,
          date: startDate,
          notes: 'Simulation Amadeus',
          receipt: null as unknown as string | undefined,
          createdAt: nowIso,
        },
        {
          id: `exp_${Date.now()}_2`,
          tripId,
          userId,
          title: 'Hôtel (1 nuit)',
          amount: mockHotelPrice,
          currency,
          category: 'accommodation' as const,
          date: startDate,
          notes: 'Simulation Amadeus',
          receipt: null as unknown as string | undefined,
          createdAt: nowIso,
        },
        {
          id: `exp_${Date.now()}_3`,
          tripId,
          userId,
          title: 'Repas',
          amount: mockMealPrice,
          currency,
          category: 'food' as const,
          date: startDate,
          notes: 'Simulation Google Places',
          receipt: null as unknown as string | undefined,
          createdAt: nowIso,
        },
      ];

      await db.insert(expenses).values(mockExpenses);

      return {
        locations: mockLocations,
        checklists: mockChecklist,
        expenses: mockExpenses,
        offers: {
          flight: { provider: 'Amadeus', price: mockFlightPrice, currency, duration: '2h30', details: `Vol ${destinationCity}` },
          hotel: { provider: 'Amadeus', pricePerNight: mockHotelPrice, currency, details: 'Hôtel central – simulation' },
          food: { provider: 'Google Places', avgMeal: mockMealPrice, currency, details: 'Moyenne repas – simulation' },
        },
      };
    } catch (err) {
      console.error('[trips.plan] error', err);
      throw err;
    }
  });
