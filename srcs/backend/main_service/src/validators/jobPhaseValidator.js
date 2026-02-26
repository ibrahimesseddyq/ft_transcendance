import {z} from 'zod';
import {PhaseType} from '../../generated/prisma/index.js';

export const createJobPhaseSchema = z.object({
	jobId : z.string().uuid(),
	phaseType: z.nativeEnum(PhaseType),
	name: z.string()
		.max(100, 'name length should be less than 100'),
	description: z.string(),
	orderIndex: z.number(), //maybe should ignored and the oreder will be based on creation
	isRequired: z.boolean().default(true),
	durationMinutes: z.number(),
	testId: z.string().uuid(),

});