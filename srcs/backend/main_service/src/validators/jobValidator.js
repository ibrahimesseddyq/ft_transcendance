const {z} = require('zod');
const {JobStatus} = require('../../generated/prisma');

const createJobSchema = z.object({
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
      .max(50, "employmentType is too Long")
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
    status: z.enum(["open", "closed", "archived"])
      .default("open"),
  }).refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"], });

const updateJobSchema = createJobSchema

module.exports = {
    createJobSchema,
    updateJobSchema
}
