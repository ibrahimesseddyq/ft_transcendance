import { z } from 'zod';
import { JobStatus } from '../../generated/prisma/index.js';

export const createJobSchema = z.object({
    title: z.string()
        .min(1, { message: "Title is required" })
        .max(255, { message: "Title must be less than 255 characters" })
        .trim(),

    department: z.string()
        .max(100, { message: "Department must be less than 100 characters" })
        .optional()
        .nullable(),

    description: z.string().optional().nullable(),

    requirements: z.string().optional().nullable(),

    location: z.string()
        .max(255, { message: "Location must be less than 255 characters" })
        .optional()
        .nullable(),

    skills: z.string().optional().nullable(),

    isRemote: z.boolean().default(false).optional(),

    employmentType: z.string()
        .max(50, { message: "Employment type must be less than 50 characters" })
        .optional()
        .nullable(),

    salaryMin: z.number().int().optional().nullable(),

    salaryMax: z.number().int().optional().nullable(),

    salaryCurrency: z.string()
        .length(3, { message: "Currency must be a 3-letter code" })
        .default("USD")
        .optional(),

    status: z.nativeEnum(JobStatus).default(JobStatus.open).optional(),

    closedAt: z.string().datetime().optional().nullable(),
});

export const updateJobSchema = createJobSchema
    .partial()
    .refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update"
    });
