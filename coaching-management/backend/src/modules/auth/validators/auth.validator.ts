import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required and cannot be empty.' }),
  password: z.string().min(1, { message: 'Password is required and cannot be empty.' }),
});

export type LoginInputDto = z.infer<typeof loginSchema>;
