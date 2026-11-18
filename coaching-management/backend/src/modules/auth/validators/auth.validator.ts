import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required and cannot be empty.' }),
  password: z.string().min(1, { message: 'Password is required and cannot be empty.' }),
});

export const createUserSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }).max(100),
  email: z.string().email({ message: 'Invalid email format.' }).optional().nullable(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  fullName: z.string().min(1, { message: 'Full name is required.' }).max(150),
  roleName: z.enum(['ADMIN', 'HELPDESK', 'RECEPTIONIST', 'FOUNDING_MEMBER'], {
    errorMap: () => ({ message: 'Invalid role name. Must be ADMIN, HELPDESK, RECEPTIONIST, or FOUNDING_MEMBER.' }),
  }),
});

export type LoginInputDto = z.infer<typeof loginSchema>;
export type CreateUserInputDto = z.infer<typeof createUserSchema>;

