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
    .min(1, "job location is required"),
    isRemote: z.boolean().default(false),
    employmentType:z.string(),
    salaryMin: z.number().int(),
    salaryMax: z.number().int(),
    salaryCurrency: z.string()
    .min(3,"salary currency must be a 3-letter code")
    .max(3,"salary currency must be a 3-letter code")
    .default('USD'),
    status: z.nativeEnum(JobStatus)
    .default(JobStatus.open),
    createdBy:z.string()
})
const updateJobSchema = createJobSchema.partial()

module.exports = {
    createJobSchema,
    updateJobSchema
}