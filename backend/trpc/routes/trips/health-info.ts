import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips, checklists, notifications } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';

interface VaccineItem {
  name: string;
  required?: boolean;
  recommended?: boolean;
  description?: string;
}
interface HealthCountry {
  vaccinations: VaccineItem[];
  risks?: string[];
}

function readHealthData(): Record<string, HealthCountry> {
  try {
    const p = path.join(process.cwd(), 'data', 'health.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as Record<string, HealthCountry>;
  } catch {
    console.warn('[health-info] health.json not found or invalid, using fallback');
    return {} as Record<string, HealthCountry>;
  }
}

export const fetchHealthInfoProcedure = publicProcedure
  .input(z.object({ tripId: z.string() }))
  .mutation(async ({ input }) => {
    const { tripId } = input;
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));
    if (!trip) throw new Error('Trip not found');

    const healthData = readHealthData();
    const entry = healthData[trip.country];

    const vaccines: VaccineItem[] = entry?.vaccinations ?? [
      { name: 'Hépatite A', recommended: true },
      { name: 'Tétanos-Diphtérie', recommended: true },
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

    const reminderId = `notif_${Date.now()}_vaccines`;
    await db.insert(notifications).values([
      {
        id: reminderId,
        userId: trip.userId,
        type: 'reminder',
        title: 'Rappel vaccins',
        message: `Vérifiez vos vaccins pour ${trip.country} avant le ${new Date(trip.startDate).toLocaleDateString()}`,
        read: false,
        actionUrl: undefined as unknown as string | undefined,
        createdAt: now,
      },
    ]);

    return { country: trip.country, vaccinations: vaccines, healthRisks: entry?.risks ?? [] };
  });
