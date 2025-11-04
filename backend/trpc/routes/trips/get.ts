import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips, locations } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const getTripsByUserProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const userTrips = await db.select().from(trips).where(eq(trips.userId, input.userId));

    const tripsWithLocations = await Promise.all(
      userTrips.map(async (trip) => {
        const tripLocations = await db.select().from(locations).where(eq(locations.tripId, trip.id));

        return {
          id: trip.id,
          title: trip.title,
          description: trip.description,
          destination: trip.destination,
          country: trip.country,
          startDate: trip.startDate,
          endDate: trip.endDate,
          coverImage: trip.coverImage || undefined,
          budget: {
            total: trip.budgetTotal,
            spent: trip.budgetSpent,
            currency: trip.budgetCurrency,
            breakdown: {
              transport: trip.budgetTransport,
              accommodation: trip.budgetAccommodation,
              food: trip.budgetFood,
              activities: trip.budgetActivities,
              other: trip.budgetOther,
            },
          },
          status: trip.status,
          isPublic: trip.isPublic,
          travelers: trip.travelers,
          notes: trip.notes || '',
          locations: tripLocations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address,
            country: loc.country,
            city: loc.city,
            type: loc.type,
          })),
          createdAt: trip.createdAt,
          updatedAt: trip.updatedAt,
        };
      })
    );

    console.log('[getTripsByUser] Fetched trips for user:', input.userId, '- Count:', tripsWithLocations.length);
    return tripsWithLocations;
  });

export const getTripByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const [trip] = await db.select().from(trips).where(eq(trips.id, input.id));
    if (!trip) return null;

    const tripLocations = await db.select().from(locations).where(eq(locations.tripId, trip.id));

    return {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      destination: trip.destination,
      country: trip.country,
      startDate: trip.startDate,
      endDate: trip.endDate,
      coverImage: trip.coverImage || undefined,
      budget: {
        total: trip.budgetTotal,
        spent: trip.budgetSpent,
        currency: trip.budgetCurrency,
        breakdown: {
          transport: trip.budgetTransport,
          accommodation: trip.budgetAccommodation,
          food: trip.budgetFood,
          activities: trip.budgetActivities,
          other: trip.budgetOther,
        },
      },
      status: trip.status,
      isPublic: trip.isPublic,
      travelers: trip.travelers,
      notes: trip.notes || '',
      locations: tripLocations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: loc.address,
        country: loc.country,
        city: loc.city,
        type: loc.type,
      })),
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  });
