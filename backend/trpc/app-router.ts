import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { createUserProcedure } from "./routes/users/create";
import { getUserProcedure, getUserByEmailProcedure } from "./routes/users/get";
import { updateUserProcedure } from "./routes/users/update";
import { deleteUserProcedure } from "./routes/users/delete";
import { createTripProcedure } from "./routes/trips/create";
import { getTripsByUserProcedure, getTripByIdProcedure } from "./routes/trips/get";
import { updateTripProcedure } from "./routes/trips/update";
import { deleteTripProcedure } from "./routes/trips/delete";
import { getAllActivitiesProcedure, getActivityByIdProcedure } from "./routes/activities/get";
import { createActivityProcedure } from "./routes/activities/create";
import { createBookingProcedure } from "./routes/activities/bookings/create";
import { getUserBookingsProcedure } from "./routes/activities/bookings/get";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  users: createTRPCRouter({
    create: createUserProcedure,
    get: getUserProcedure,
    getByEmail: getUserByEmailProcedure,
    update: updateUserProcedure,
    delete: deleteUserProcedure,
  }),
  trips: createTRPCRouter({
    create: createTripProcedure,
    getByUser: getTripsByUserProcedure,
    getById: getTripByIdProcedure,
    update: updateTripProcedure,
    delete: deleteTripProcedure,
  }),
  activities: createTRPCRouter({
    getAll: getAllActivitiesProcedure,
    getById: getActivityByIdProcedure,
    create: createActivityProcedure,
    bookings: createTRPCRouter({
      create: createBookingProcedure,
      getByUser: getUserBookingsProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;
