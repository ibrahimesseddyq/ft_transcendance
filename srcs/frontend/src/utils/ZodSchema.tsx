import { z } from "zod";

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
        .min(8, {message: "Password must be at least 8 characters long"})
        .max(100, { message: "Password must be less than 100 characters" })
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[A-Z]/, { message:  "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character"})
        .regex(/^\S+$/, { message: "Password must not contain spaces" }),  

});

export const CreateJobSchema = z.object({
    title: z.string()
        .min(1, "job should a have a valid title"),
    department: z.string()
        .min(1, "job should have a valid department name"),
    description: z.string()
        .min(50, "job should have a valid description"),
    requirements: z.string()
        .min(100, "job requirements is required"),
    location: z.string()
        .min(1, "job location is required"),
    // isRemote: z.boolean().default(false),
    employmentType:z.string(),
    // salaryMin: z.coerce.number()
    //     .int()
    //     .nonnegative("Salary cannot be negative"),
    // salaryMax: z.coerce.number()
    //     .int()
    //     .nonnegative("Salary cannot be negative"),
    // salaryCurrency: z.string()
    //     .length(3, "Currency must be exactly a 3-letter code (e.g., USD)")
    //     .default('USD'),
    createdBy:z.string()
});