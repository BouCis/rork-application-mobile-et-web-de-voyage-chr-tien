import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "@/backend/db";
import { activities } from "@/backend/db/schema";
import { eq, and } from "drizzle-orm";

export const getAllActivitiesProcedure = publicProcedure
  .input(
    z.object({
      category: z.string().optional(),
      search: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
    }).optional()
  )
  .query(async ({ input }) => {
    console.log('[tRPC] Getting all activities with filters:', input);

    const conditions = [eq(activities.isActive, true)];

    if (input?.category) {
      conditions.push(eq(activities.category, input.category as any));
    }

    if (input?.city) {
      conditions.push(eq(activities.city, input.city));
    }

    if (input?.region) {
      conditions.push(eq(activities.region, input.region));
    }

    let query = db.select().from(activities);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    if (input?.search) {
      const searchLower = input.search.toLowerCase();
      return results.filter(
        (activity) =>
          activity.name.toLowerCase().includes(searchLower) ||
          activity.location.toLowerCase().includes(searchLower) ||
          activity.category.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower)
      );
    }

    return results;
  });

export const getActivityByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    console.log('[tRPC] Getting activity by ID:', input.id);

    const result = await db
      .select()
      .from(activities)
      .where(eq(activities.id, input.id))
      .limit(1);

    if (result.length === 0) {
      throw new Error('Activity not found');
    }

    return result[0];
  });
