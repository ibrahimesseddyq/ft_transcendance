const { z } = require('zod');
const signupSchema = z.object({
    
    firstName: z.string()
    .pipe(
        z.string()
        .trim()
        .toLowerCase()
        .min(1, "The First Name is required")
        .min(2, "The First Name must be at least 2 characters")
        .max(75, "The First Name must be at most 75 characters")
        .regex(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Only letters, spaces, apostrophes, and hyphens are allowed. The name must start and end with a letter, cannot contain consecutive spaces or symbols, and supports accented characters.")

    ),
    
    lastName: z.string()
    .min(1, "The Last Name is required")
    .pipe(
        z.string()
        .trim()
        .toLowerCase()
        .min(2, "The Last Name must be at least 2 characters")
        .max(75, "The Last Name must be at most 75 characters")
        .regex(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
        "Only letters, spaces, apostrophes, and hyphens are allowed. The name must start and end with a letter, cannot contain consecutive spaces or symbols, and supports accented characters.")
    ),
    
    email: z.string()
    .min(1, "Email is required")
    .pipe(
        z.string()
        .email("Invalid email format")
    ),

    phone: z.string()
    .min(1, "Phone Number is required")
    .pipe(
        z.string()
        .regex(
            /^(\+?212|0)([ \-]?)([5-7])(\d{1})(\2?)(\d{7})$/,
            "Invalid phone number. Must start with 06, 07, or 05 (or +212/212)"
        )
    ),

    passwordHash: z.string()
    .min(1, "The Password is required")
    .pipe(
        z.string()
        .min(10, "Password must be at least 10 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character")
    ),
});


module.exports = {signupSchema};