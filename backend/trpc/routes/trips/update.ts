import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

export const updateTripProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      destination: z.string().optional(),
      country: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      coverImage: z.string().optional(),
      budget: z
        .object({
          total: z.number().optional(),
          spent: z.number().optional(),
          currency: z.string().optional(),
          breakdown: z
            .object({
              transport: z.number().optional(),
              accommodation: z.number().optional(),
              food: z.number().optional(),
              activities: z.number().optional(),
              other: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
      status: z.enum(['planning', 'upcoming', 'ongoing', 'completed']).optional(),
      isPublic: z.boolean().optional(),
      travelers: z.number().optional(),
      notes: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, budget, ...updates } = input;

    const updateData: any = { ...updates, updatedAt: sql`CURRENT_TIMESTAMP` };

    if (budget) {
      if (budget.total !== undefined) updateData.budgetTotal = budget.total;
      if (budget.spent !== undefined) updateData.budgetSpent = budget.spent;
      if (budget.currency !== undefined) updateData.budgetCurrency = budget.currency;
      if (budget.breakdown) {
        if (budget.breakdown.transport !== undefined)
          updateData.budgetTransport = budget.breakdown.transport;
        if (budget.breakdown.accommodation !== undefined)
          updateData.budgetAccommodation = budget.breakdown.accommodation;
        if (budget.breakdown.food !== undefined) updateData.budgetFood = budget.breakdown.food;
        if (budget.breakdown.activities !== undefined)
          updateData.budgetActivities = budget.breakdown.activities;
        if (budget.breakdown.other !== undefined) updateData.budgetOther = budget.breakdown.other;
      }
    }

    const [trip] = await db.update(trips).set(updateData).where(eq(trips.id, id)).returning();
    console.log('[updateTrip] Trip updated:', trip.id);
    return trip;
  });
