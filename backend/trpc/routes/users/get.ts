import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const getUserProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const [user] = await db.select().from(users).where(eq(users.id, input.id));
    console.log('[getUser] User fetched:', user?.id);
    return user || null;
  });

export const getUserByEmailProcedure = publicProcedure
  .input(z.object({ email: z.string().email() }))
  .query(async ({ input }) => {
    const [user] = await db.select().from(users).where(eq(users.email, input.email));
    console.log('[getUserByEmail] User fetched:', user?.id);
    return user || null;
  });
