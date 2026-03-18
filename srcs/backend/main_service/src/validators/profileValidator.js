import {z} from 'zod';
  
export const createProfileSchema = z.object({

  numberPhone: z.number()
    .optional(),  

  linkedinUrl: z.string()
    .optional(),

  portfolioUrl: z.string()
    .optional(),

  currentCompany: z.string()
    .optional(),

  currentTitle: z.string()
    .optional(),

  yearsExperience: z.number()
    .optional(),

  skills: z.string()
    .optional(),

  preferredLocations: z.string()
    .optional(),

  salaryExpectation: z.string()
    .optional(),

}).strict();


export const updateProfileSchema = createProfileSchema.partial().strict();