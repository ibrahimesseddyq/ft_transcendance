import { z } from "zod";

const fileOrUrlSchema = (maxMb: number) => z.any()
  .transform((v) => (v instanceof FileList ? v.item(0) ?? undefined : v))
  .refine(
    (v) => !v || typeof v === "string" || v instanceof File,
    { message: "Must be a file" }
  )
  .refine(
    (v) => !(v instanceof File) || v.size <= maxMb * 1024 * 1024,
    { message: `File must be under ${maxMb}MB` }
  )
  .optional();


export const RegisterSchema = z.object({
    firstName: z.string()
        .min(1,{message : "First name is required"})
        .max(100, { message: "First name must be less than 100 characters" })
        .trim(),
    lastName: z.string()
        .min(1,{message :"Last name is required"})
        .max(100,{ message: "Last name must be less than 100 characters" })
        .trim(),

    email: z.string().email({ message: "Must be a valid email address" })
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, {message: "Password must be at least 8 characters long"})
        .max(100, { message: "Password must be less than 100 characters" })
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, { message:  "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character"})
        .regex(/^\S+$/, { message: "Password must not contain spaces" }),
    confirmPassword: z.string()
        .min(1,{message : "First name is required"}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const LoginSchema = z.object({
    email: z.string().trim()
        .toLowerCase()
        .email({ message: "Must be a valid email address" }),
    password: z.string()
        .min(1, {message: "Password is required"})
});


export const CreateJobSchema = z.object({
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

export const ApplyJobSchema = z.object({
  fullName: z.string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Name is too long"),
    
  email: z.string()
    .email("Invalid email address"),
  
  phoneNumber: z.number()
    .min(10, "Phone number must be at least 10 characters"),

  cv: fileOrUrlSchema(10),

  coverLetter: z.string()
    .min(50, "Cover letter should be at least 50 characters")
    .optional(),

  portfolioUrl: z.string()
    .optional()
    .or(z.literal("")),

  linkedinUrl: z.string()
    .optional()
    .or(z.literal("")),

});

export const CandidateProfileSchema = z.object({

  avatar:    fileOrUrlSchema(10),
  resumeUrl: fileOrUrlSchema(10),

  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .pipe(
      z.string()
        .min(10, { message: 'Must be a valid mobile number' })
        .max(14, { message: 'Must be a valid mobile number' })
    ),
  
  linkedinUrl: z.string()
    .url()
    .min(1, "linkedinUrl is required"),

  portfolioUrl: z.string()
    .optional(),

  // yearsExperience: z.coerce.number() 
  //   .int()
  //   .min(0)
  //   .optional()
  //   .nullable(),

  currentCompany: z.string()
    .optional(),

  currentTitle: z.string()
    .min(1, "Current Job Title is required"),

  availableFrom: z.string().optional(),

  skills: z.string(),

});

const chicesSchema =  z.object({
    text: z.string().min(1, "Choice text cannot be empty"),
    isCorrect: z
      .boolean()
      .default(false)
})

// title: z.string()
//         .min(3, "Title must be at least 3 characters")
//         .max(255, " title should not be more than 255 char"),
//     description: z.string().optional(),
//     durationMinutes: z.number()
//         .int()
//         .positive(),
//     passingScore: z.number()
//         .int()
//         .positive()
//         .min(50, "passing score should not be less than 50")
//         .max(100, "passing score should not be greater than 100")
//         .default(60),
//     category : z.string()
//         .optional(),
//     difficulty: z.nativeEnum(Difficulty),
//     tags: z.array(z.string())
//         .optional(),
//     isPublished: z.boolean()
//         .default(false),
export const McqSchema =  z.object({
    title: z.string()
      .min(3, "Title must be at least 3 characters")
      .max(255, " title should not be more than 255 char"),
    durationMinutes: z.number()
      .int()
      .positive(),
    question: z
      .string()
      .min(1, "min Characters should be 10"),
    choices: z
      .array(chicesSchema)
      .length(4, "Must provide exactly 4 choices"),
    passingScore: z.number()
      .int()
      .positive()
      .min(50, "passing score should not be less than 50")
      .max(100, "passing score should not be greater than 100")
      .default(60),
    explanation: z
      .string()
      .optional(),
    category: z
      .string()
      .max(100),
    difficulty: z
      .string()
      .default('EASY'),
    tags:  z
      .array(z.string())
      .optional(),
    isPublished: z
      .boolean()
      .optional(),
})