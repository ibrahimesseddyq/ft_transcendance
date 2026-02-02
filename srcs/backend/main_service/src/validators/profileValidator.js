const {z} = require('zod');
const fileSchema = z
  .file()
  .max(5_000_000)
  
const createProfileschema = z.object({
  avatar: z
    .any()
    .optional()
    .transform((v) => (v instanceof FileList ? v.item(0) ?? undefined : v))
    .pipe(fileSchema.optional()),

  resume: z
    .any()
    .transform((v) => (v instanceof FileList ? v.item(0) ?? undefined : v))
    .pipe(fileSchema),

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

  availableFrom: z.iso.date()
    .optional(),
});


const updateProfileschema = createProfileschema.partial();

module.exports = {
    createProfileschema,
    updateProfileschema
}