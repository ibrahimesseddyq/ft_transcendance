import {z, nativeEnum} from 'zod';
import {ApplicationStatus}  from '../../generated/prisma/index.js';

const createApplicationSchema =  z.object({
	jobId:z.string(),
	candidateId: z.string(),
	status:nativeEnum(ApplicationStatus).default(ApplicationStatus.pending),
	currentPhaseId:z.string(),
});
