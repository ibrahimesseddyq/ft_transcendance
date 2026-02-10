const {z} = require('zod');
const {JobStatus} = require('../../generated/prisma');
const baseSchema = z.object({
    title: z.string()
      .min(1, "Title is required"),
    department: z.string()
      .min(5, "department is required"),
    description: z.string()
      .min(20, "description is required"),
    requirements: z.string()
      .optional(),
    skills: z.string()
      .optional(),
    location: z.string()
      .min(1, "location is required"),
    isRemote: z.boolean()
      .default(false),
    employmentType: z.string()
      .min(1, "employmentType is required")
      .max(50, "employmentType is too long")
      .default('full-time'),
    salaryMin: z.number()
      .int()
      .min(1000, "Salary should be at least 1000"),
    salaryMax: z.number()
      .int(),
    salaryCurrency: z.string()
      .min(3,"salary currency must be a 3-letter code")
      .max(3,"salary currency must be a 3-letter code")
      .default('USD'),
    status: z.nativeEnum(JobStatus)
      .default(JobStatus.open),
});

const createJobSchema = baseSchema.refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"], });

const updateJobSchema = baseSchema.partial();

module.exports = {
    createJobSchema,
    updateJobSchema
}
