import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

export const updateUserProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      emailVerified: z.boolean().optional(),
      verificationCode: z.string().optional(),
      verificationCodeExpiresAt: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      age: z.number().optional(),
      gender: z.enum(['male', 'female']).optional(),
      nationality: z.string().optional(),
      countryOfBirth: z.string().optional(),
      departureCity: z.string().optional(),
      avatar: z.string().optional(),
      bio: z.string().optional(),
      travelStyle: z.enum(['cultural', 'adventure', 'relaxation', 'mixed']).optional(),
      budgetRange: z.enum(['budget', 'moderate', 'luxury']).optional(),
      notifications: z.boolean().optional(),
      inspirations: z.boolean().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { id, ...updates } = input;
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(users.id, id))
      .returning();
    console.log('[updateUser] User updated:', user.id);
    return user;
  });
