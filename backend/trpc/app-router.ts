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
import { planTripProcedure } from "./routes/trips/plan";
import { fetchVisaInfoProcedure } from "./routes/trips/visa-info";
import { fetchHealthInfoProcedure } from "./routes/trips/health-info";
import { createActivityProcedure } from "./routes/activities/create";
import { createBookingProcedure } from "./routes/activities/bookings/create";
import { getUserBookingsProcedure } from "./routes/activities/bookings/get";
import { sendVerificationEmailProcedure } from "./routes/emails/send-verification";
import { searchFlightsProcedure, searchHotelsProcedure, searchCityOrAirportProcedure } from "./routes/external/amadeus";
import { searchPlacesProcedure } from "./routes/external/places";

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
    plan: planTripProcedure,
    visaInfo: fetchVisaInfoProcedure,
    healthInfo: fetchHealthInfoProcedure,
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
  emails: createTRPCRouter({
    sendVerification: sendVerificationEmailProcedure,
  }),
  external: createTRPCRouter({
    amadeus: createTRPCRouter({
      flights: searchFlightsProcedure,
      hotels: searchHotelsProcedure,
      cityOrAirport: searchCityOrAirportProcedure,
    }),
    places: createTRPCRouter({
      search: searchPlacesProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;
