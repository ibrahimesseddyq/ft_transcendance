const {z} = require('zod');
const {UserRole} = require('../../generated/prisma');

const createUserSchema = z.object({
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

    confirmPassword: z.string().optional(),

    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/,{ message:  "Must be a valid phone number" })
        .optional()
        .nullable(),
    role: z.nativeEnum(UserRole)
        .default(UserRole.candidate)
        .optional(),

    avatarUrl: z.string()
        .url({ message: "Must be a valid URL" })
        .optional()
        .nullable(),
    refreshToken: z.string()
        .optional(),
}).strict();

const updateUserSchema = createUserSchema
    .partial()
    .omit({password : true})
    .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
});

const registerUserSchema = createUserSchema.pick({ 
    firstName: true,
    lastName: true,
    email:true,
    password:true,
    confirmPassword: true
}).refine(data => data.password === data.confirmPassword,{
  message: "passwords does not match",
  path:['confirmpassword'],
}).transform(({confirmPassword, ...rest}) => rest);

const loginUserSchema = z.object({
    email: z.string()
        .email({ message: "Must be a valid email address" })
        .toLowerCase()
        .trim(),
    
    password: z.string()
        .min(1, { message: "Password is required" }),
});

const verifyEmailSchema = z.object({
    token: z.string().min(1, { message: "Verification token is required" }),
});

const passwordResetRequestSchema = z.object({
    email: z.string()
        .email({ message: "Must be a valid email address" })
        .toLowerCase(),
});

const passwordResetSchema = z. object({
  token: z. string().min(1, { message: "Reset token is required" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character"})
    .regex(/^\S+$/, { message: "Password must not contain spaces" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
     .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, {
            message: "Password must contain at least one special character"})
    .regex(/^\S+$/, { message: "Password must not contain spaces" }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path:  ["confirmNewPassword"],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

const listUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
  role: z.nativeEnum(UserRole).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'email']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  registerUserSchema,
  loginUserSchema,
  verifyEmailSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  changePasswordSchema,
  listUsersQuerySchema,
};