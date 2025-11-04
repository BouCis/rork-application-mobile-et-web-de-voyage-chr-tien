import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { users } from '../../../db/schema';

export const createUserProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      emailVerified: z.boolean().default(false),
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
      travelStyle: z.enum(['cultural', 'adventure', 'relaxation', 'mixed']).default('mixed'),
      budgetRange: z.enum(['budget', 'moderate', 'luxury']).default('moderate'),
      notifications: z.boolean().default(true),
      inspirations: z.boolean().default(true),
      joinedDate: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const [user] = await db.insert(users).values(input).returning();
    console.log('[createUser] User created:', user.id);
    return user;
  });
