const {z} = require('zod');
const {JobStatus} = require('../../generated/prisma');

const createJobSchema = z.object({
    title: z.string()
    .min(1, "job should a have a valid title"),
    department: z.string()
    .min(1, "job should have a valid department name"),
    description: z.string()
    .min(50, "job should have a valid description"),
    requirements: z.string()
    .min(100, "job requirements is required"),
    location: z.string()
    .min(1, "job location is need"),
    isRemote: z.boolean().default(false),
    employmentType:z.string(),
    salaryMin: z.int(),
    salaryMax: z.int(),
    salaryCurrency: z.string()
    .default('USD')
    .min(3,)
    .max(3),
    status: z.enum(JobStatus)
    .default(JobStatus.open),
    createdBy:z.string()
})