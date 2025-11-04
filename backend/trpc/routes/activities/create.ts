import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "@/backend/db";
import { activities } from "@/backend/db/schema";

export const createActivityProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      location: z.string(),
      city: z.string(),
      region: z.string(),
      country: z.string().default('France'),
      rating: z.number(),
      reviews: z.number().default(0),
      price: z.number(),
      duration: z.string(),
      image: z.string(),
      category: z.enum(['Culture', 'Aventure', 'Nature', 'Gastronomie', 'Sport', 'Visites', 'Plage']),
      description: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[tRPC] Creating activity:', input.name);

    const result = await db.insert(activities).values({
      ...input,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return result[0];
  });
