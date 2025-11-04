import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { db } from "@/backend/db";
import { activityBookings } from "@/backend/db/schema";

export const createBookingProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      activityId: z.string(),
      tripId: z.string().optional(),
      bookingDate: z.string(),
      numberOfPeople: z.number().default(1),
      totalPrice: z.number(),
      notes: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[tRPC] Creating activity booking:', input);

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await db.insert(activityBookings).values({
      id: bookingId,
      userId: input.userId,
      activityId: input.activityId,
      tripId: input.tripId,
      bookingDate: input.bookingDate,
      numberOfPeople: input.numberOfPeople,
      totalPrice: input.totalPrice,
      notes: input.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return result[0];
  });
