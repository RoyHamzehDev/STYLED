import { z } from "zod";
import { STYLES, COLORS } from "./clothing.js";

export const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50),
  email: z.email("Invalid email").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>; //hover over RegisterDto to see the type definition
export type LoginDto = z.infer<typeof LoginSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50).optional(),
  preferredStyles: z
    .array(z.enum(STYLES))
    .transform((styles) => [...new Set(styles)])
    .optional(),
  favoriteColors: z
    .array(z.enum(COLORS))
    .transform((colors) => [...new Set(colors)])
    .optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;