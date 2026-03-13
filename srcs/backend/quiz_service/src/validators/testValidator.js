import {z} from 'zod';
import {TestType, Difficulty} from '../../generated/prisma/client.js';

const baseTestSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(255, " title should not be more than 255 characters"),
    description: z.string().optional(),
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

export const createTestSchema = z.discriminatedUnion("type",[
    baseTestSchema.extend({
        type : z.literal(TestType.QUIZ),
        mcqIds : z.array(z.string().uuid("Invalid MCQ ID format"))
        .min(1, "A QUIZ must contain at least one MCQ")
    }).strict(),
    baseTestSchema.extend({
        type: z.literal(TestType.CODE),
        codeId: z.string().uuid("Code test requires a valid Code Challenge ID")
    }).strict()
])
const updateBaseTestSchema = baseTestSchema.partial();

const updateQuizTestSchema = updateBaseTestSchema.extend({
    type : z.literal(TestType.QUIZ).optional(),
    mcqIds : z.array(z.string().uuid("Invalid MCQ ID format"))
        .min(1, "A QUIZ must contain at least one MCQ")
        .optional()
}).strict();

const updateCodeTestSchema = updateBaseTestSchema.extend({
    type: z.literal(TestType.CODE).optional(),
    codeChallengeId: z.string()
        .uuid("Code test requires a valid Code Challenge ID")
        .optional()
}).strict();

export const updateTestSchema = z.union([
    updateQuizTestSchema,
    updateCodeTestSchema
]);