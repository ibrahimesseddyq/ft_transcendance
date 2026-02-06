const {z, boolean} = require('zod');
const {PhaseType} = require('../../generated/prisma');

const createJobPhaseSchema = z.object({
	jobId : z.string(),
	phaseType: z.nativeEnum(PhaseType),
	name: z.string(),
	description: z.string(),
	orderIndex: z.number(), //maybe should ignored and the oreder will be based on creation
	isRequired: z.boolean().default(true),
	durationMinutes: z.number(),

});


module.exports = {
	createJobPhaseSchema
}