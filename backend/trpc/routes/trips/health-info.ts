import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips, checklists, notifications } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const fetchHealthInfoProcedure = publicProcedure
  .input(z.object({ tripId: z.string() }))
  .mutation(async ({ input }) => {
    const { tripId } = input;
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));
    if (!trip) throw new Error('Trip not found');

    const vaccines = [
      { name: 'Fièvre jaune', required: false, recommended: trip.country === 'Brésil', description: 'Peut être requis dans certaines zones' },
      { name: 'Hépatite A', required: false, recommended: true, description: 'Recommandé pour la plupart des pays' },
      { name: 'Tétanos-Diphtérie', required: false, recommended: true, description: 'Mise à jour conseillée' },
    ];

    const now = new Date().toISOString();

    await db.insert(checklists).values([
      {
        id: `chk_${Date.now()}_health`,
        tripId,
        userId: trip.userId,
        title: 'Vaccins à vérifier',
        description: vaccines.map(v => `${v.name}${v.required ? ' (requis)' : v.recommended ? ' (reco)' : ''}`).join(', '),
        category: 'health',
        completed: false,
        dueDate: trip.startDate,
        priority: 'medium',
        reminder: trip.startDate,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return { country: trip.country, vaccinations: vaccines };
  });
