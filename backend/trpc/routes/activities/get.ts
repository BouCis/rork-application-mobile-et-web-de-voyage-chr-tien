import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { db } from "@/backend/db";
import { activities } from "@/backend/db/schema";
import { eq, and } from "drizzle-orm";

const fallbackActivities = [
  {
    id: "act_1",
    name: "Visite de l'Île de Gorée",
    location: "Île de Gorée, Dakar",
    city: "Dakar",
    region: "Dakar",
    country: "Sénégal",
    rating: 5,
    reviews: 1240,
    price: 15,
    duration: "4h",
    image: "https://images.unsplash.com/photo-1609198092357-c7c2b7e5e8e8?w=1200",
    category: "Culture",
    description: "Site historique classé à l'UNESCO, traversée en chaloupe et maison des esclaves.",
    latitude: 14.6667,
    longitude: -17.3989,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "act_2",
    name: "Excursion au Lac Rose",
    location: "Lac Retba, Rufisque",
    city: "Rufisque",
    region: "Dakar",
    country: "Sénégal",
    rating: 4,
    reviews: 860,
    price: 45,
    duration: "5h",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200",
    category: "Nature",
    description: "Eaux roses uniques, dunes et récolte traditionnelle du sel.",
    latitude: 14.8444,
    longitude: -17.2167,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "act_3",
    name: "Cours de cuisine sénégalaise",
    location: "Plateau, Dakar",
    city: "Dakar",
    region: "Dakar",
    country: "Sénégal",
    rating: 5,
    reviews: 320,
    price: 50,
    duration: "3h",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    category: "Gastronomie",
    description: "Apprenez à préparer le thiéboudienne et d'autres plats emblématiques.",
    latitude: 14.6937,
    longitude: -17.4441,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getAllActivitiesProcedure = publicProcedure
  .input(
    z
      .object({
        category: z.string().optional(),
        search: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    console.log("[tRPC] Getting all activities with filters:", input);

    try {
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
        query = (query.where(and(...conditions)) as unknown) as typeof query;
      }

      const results = await query;

      if (input?.search) {
        const searchLower = input.search.toLowerCase();
        return results.filter((activity) =>
          activity.name.toLowerCase().includes(searchLower) ||
          activity.location.toLowerCase().includes(searchLower) ||
          activity.category.toLowerCase().includes(searchLower) ||
          activity.description.toLowerCase().includes(searchLower)
        );
      }

      return results;
    } catch (err) {
      console.error("[tRPC] activities.getAll fallback due to DB error:", err);

      let results = fallbackActivities;

      if (input?.category) {
        results = results.filter((a) => a.category === input.category);
      }
      if (input?.city) {
        results = results.filter((a) => a.city === input.city);
      }
      if (input?.region) {
        results = results.filter((a) => a.region === input.region);
      }
      if (input?.search) {
        const s = input.search.toLowerCase();
        results = results.filter(
          (a) =>
            a.name.toLowerCase().includes(s) ||
            a.location.toLowerCase().includes(s) ||
            a.category.toLowerCase().includes(s) ||
            a.description.toLowerCase().includes(s)
        );
      }

      return results;
    }
  });

export const getActivityByIdProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    console.log("[tRPC] Getting activity by ID:", input.id);

    try {
      const result = await db
        .select()
        .from(activities)
        .where(eq(activities.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new Error("Activity not found");
      }

      return result[0];
    } catch (err) {
      console.error("[tRPC] activities.getById fallback due to DB error:", err);
      const byId = fallbackActivities.find((a) => a.id === input.id);
      if (!byId) {
        throw new Error("Activity not found");
      }
      return byId;
    }
  });
