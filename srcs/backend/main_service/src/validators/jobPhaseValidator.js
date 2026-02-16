import {z} from 'zod';
import {PhaseType} from '../../generated/prisma/index.js';

export const createJobPhaseSchema = z.object({
	jobId : z.string(),
	phaseType: z.nativeEnum(PhaseType),
	name: z.string(),
	description: z.string(),
	orderIndex: z.number(), //maybe should ignored and the oreder will be based on creation
	isRequired: z.boolean().default(true),
	durationMinutes: z.number(),

});