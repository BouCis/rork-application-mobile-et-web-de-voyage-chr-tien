import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const deleteTripProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await db.delete(trips).where(eq(trips.id, input.id));
    console.log('[deleteTrip] Trip deleted:', input.id);
    return { success: true };
  });
