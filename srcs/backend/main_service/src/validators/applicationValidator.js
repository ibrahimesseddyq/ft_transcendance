const {z, nativeEnum} = require('zod');
const {ApplicationStatus}  =  require('../../generated/prisma')

const createApplicationSchema =  z.object({
	jobId:z.string(),
	candidateId: z.string(),
	status:nativeEnum(ApplicationStatus).default(ApplicationStatus.pending),
	currentPhaseId:z.string(),
});
