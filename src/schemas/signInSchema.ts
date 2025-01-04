import { z } from "zod";

export const signInSchema=z.object({
    email:z.string().email('Invalid email address'), //email hi hai
    password:z.string().min(6, 'Password must be at least 6 characters'),
});