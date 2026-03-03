import {z} from 'zod';

const CHOICE_IDS = ["A", "B", "C", "D"];

export const submissionSchema = z.object({
    testId: z.string().uuid(),
    answers: z.array(z.object({
        questionId: z.string().uuid(),
        selectedIds: z.array(z.enum(CHOICE_IDS))
            .min(1, 'at least one answer should be provided')
            .refine(ids => new Set(ids).size === ids.length,
                'duplicates not allowed')
    }))
})