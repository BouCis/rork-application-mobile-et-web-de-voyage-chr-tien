import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const deleteUserProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    await db.delete(users).where(eq(users.id, input.id));
    console.log('[deleteUser] User deleted:', input.id);
    return { success: true };
  });
