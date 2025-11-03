import { publicProcedure } from "@/backend/trpc/create-context";

export const hiProcedure = publicProcedure
  .mutation(() => {
    return {
      hello: "world",
      date: new Date(),
    };
  });
