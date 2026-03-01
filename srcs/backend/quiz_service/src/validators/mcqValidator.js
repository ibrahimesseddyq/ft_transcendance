import {z} from 'zod';
import {Difficulty} from '../../generated/prisma/client.js'

const CHOICE_IDS = ["A", "B", "C", "D"];

const choicesSchema =  z.object({
    id : z.enum(CHOICE_IDS),
    text: z.string().min(1, "Choice text cannot be empty"),
    isCorrect: z.boolean()
})
const mcqSchema =  z.object({
    question: z.string().min(),
    choices: z.array(choicesSchema)
        .length(4, "Must provide exactly 4 choices")
        .refine(choices => {
            const isCorrects = choices.filter(c => c.isCorrect).length;
            const ids =  choices.map(c => c.id);
            const uniqueIds = new Set(ids).size;
            return isCorrects >= 1 && ids.length === uniqueIds;
        }),
    points: z.number()
    .int()
    .positive("Points must be a positive integer")
    .default(1),
    explanation: z.string().optional(),
    category: z.string()
        .max(100),
    difficulty: z.nativeEnum(Difficulty),
    tags:  z.array(z.string()).optional(),
    isPublished: z.boolean()
})

export const createMcqSchema = mcqSchema.strict();
export const updateMcqSchema = mcqSchema.partial();

// const createMcqSchema = mcqSchema