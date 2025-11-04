import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { db } from "@/backend/db";
import { activityBookings, activities } from "@/backend/db/schema";
import { eq } from "drizzle-orm";

export const getUserBookingsProcedure = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    console.log('[tRPC] Getting bookings for user:', input.userId);

    const bookings = await db
      .select({
        booking: activityBookings,
        activity: activities,
      })
      .from(activityBookings)
      .innerJoin(activities, eq(activityBookings.activityId, activities.id))
      .where(eq(activityBookings.userId, input.userId));

    return bookings;
  });
