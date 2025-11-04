import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips, locations } from '../../../db/schema';

const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  country: z.string(),
  city: z.string(),
  type: z.enum(['tourist', 'historical', 'natural', 'other']),
});

export const createTripProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      userId: z.string(),
      title: z.string(),
      description: z.string(),
      destination: z.string(),
      country: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      coverImage: z.string().optional(),
      budget: z.object({
        total: z.number(),
        spent: z.number(),
        currency: z.string(),
        breakdown: z.object({
          transport: z.number(),
          accommodation: z.number(),
          food: z.number(),
          activities: z.number(),
          other: z.number(),
        }),
      }),
      status: z.enum(['planning', 'upcoming', 'ongoing', 'completed']),
      isPublic: z.boolean(),
      travelers: z.number(),
      notes: z.string(),
      locations: z.array(locationSchema).optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { locations: tripLocations, budget, ...tripData } = input;

    const [trip] = await db
      .insert(trips)
      .values({
        ...tripData,
        budgetTotal: budget.total,
        budgetSpent: budget.spent,
        budgetCurrency: budget.currency,
        budgetTransport: budget.breakdown.transport,
        budgetAccommodation: budget.breakdown.accommodation,
        budgetFood: budget.breakdown.food,
        budgetActivities: budget.breakdown.activities,
        budgetOther: budget.breakdown.other,
      })
      .returning();

    if (tripLocations && tripLocations.length > 0) {
      await db.insert(locations).values(
        tripLocations.map((loc) => ({
          ...loc,
          tripId: trip.id,
        }))
      );
    }

    console.log('[createTrip] Trip created:', trip.id);
    return trip;
  });
