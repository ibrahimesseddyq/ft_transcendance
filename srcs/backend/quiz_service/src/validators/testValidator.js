import {z} from 'zod';
import {TestType} from '../../generated/prisma/client.js';
import {Difficulty} from '../../generated/prisma/client.js';

const testSchema = z.object({
    type: z.nativeEnum(TestType),
    title: z.string()
        .max(255, " title should not be more than 255 char"),
    description: z.string(),
    durationMinutes: z.number()
        .int()
        .positive(),
    passingScore: z.number()
        .int()
        .positive()
        .min(50, "passing score should not be less than 50")
        .max(100, "passing score should not be greater than 100")
        .default(60),
    category : z.string()
        .optional(),
    difficulty: z.nativeEnum(Difficulty),
    tags: z.array(z.string())
        .optional(),
    isPublished: z.boolean()
        .default(false),
})

export const createTestSchema =  testSchema.strict()
export const updateTestSchema = testSchema.partial()
