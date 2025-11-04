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
});

export type AppRouter = typeof appRouter;
