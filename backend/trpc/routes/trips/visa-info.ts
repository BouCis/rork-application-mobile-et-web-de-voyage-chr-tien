import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { db } from '../../../db';
import { trips, checklists } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';

interface VisaRequirement {
  required: boolean;
  type?: string;
  duration?: string;
  cost?: number;
  processingTime?: string;
  requirements: string[];
  link?: string;
}

function readVisaData(): Record<string, VisaRequirement> {
  try {
    const p = path.join(process.cwd(), 'data', 'visas.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as Record<string, VisaRequirement>;
  } catch (e) {
    console.warn('[visa-info] visas.json not found or invalid, using fallback');
    return {} as Record<string, VisaRequirement>;
  }
}

export const fetchVisaInfoProcedure = publicProcedure
  .input(z.object({ tripId: z.string(), nationality: z.string().optional() }))
  .mutation(async ({ input }) => {
    const { tripId } = input;
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));
    if (!trip) throw new Error('Trip not found');

    const visaData = readVisaData();
    const requirement: VisaRequirement =
      visaData[trip.country] ?? {
        required: false,
        type: 'visa-free',
        duration: '90 jours',
        cost: 0,
        processingTime: '—',
        requirements: ['Passeport valide 6 mois', 'Billet retour', 'Preuve de fonds'],
      };

    const now = new Date().toISOString();
    await db.insert(checklists).values([
      {
        id: `chk_${Date.now()}_visa`,
        tripId,
        userId: trip.userId,
        title: 'Vérifier exigences de visa',
        description: `${trip.country}: ${requirement.type ?? ''} ${requirement.duration ? `(${requirement.duration})` : ''}`.trim(),
        category: 'documents',
        completed: false,
        dueDate: trip.startDate,
        priority: 'high',
        reminder: trip.startDate,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return { country: trip.country, ...requirement };
  });
