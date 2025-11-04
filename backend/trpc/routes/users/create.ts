import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

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
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un compte avec cet email existe déjà',
        });
      }

      const [user] = await db.insert(users).values(input).returning();
      console.log('[createUser] User created:', user.id);
      return user;
    } catch (error) {
      console.error('[createUser] Error:', error);
      
      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Un compte avec cet email existe déjà',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erreur lors de la création du compte',
      });
    }
  });
