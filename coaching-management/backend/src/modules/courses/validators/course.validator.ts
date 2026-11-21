import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().trim().min(1, { message: 'Course name is required and cannot be empty.' }).max(150, { message: 'Course name cannot exceed 150 characters.' }),
  categoryId: z.string().uuid({ message: 'Category ID must be a valid UUID.' }),
  fee: z.number().nonnegative({ message: 'Fee must be a non-negative number.' }),
  description: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
  createdBy: z.string().uuid({ message: 'Created by user ID must be a valid UUID.' }),
});

export type CreateCourseInputDto = z.infer<typeof createCourseSchema>;
