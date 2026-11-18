import { z } from 'zod';

export const createStudentSchema = z.object({
  academicBatchId: z.string().uuid({ message: 'Academic batch ID must be a valid UUID.' }),
  fullName: z.string().trim().min(1, { message: 'Full name is required and cannot be empty.' }).max(150, { message: 'Full name cannot exceed 150 characters.' }),
  roll: z.string().trim().min(1, { message: 'Roll is required and cannot be empty.' }).max(50, { message: 'Roll cannot exceed 50 characters.' }),
  phoneSelf: z.string().trim().min(1, { message: 'Phone (self) is required and cannot be empty.' }).max(30, { message: 'Phone (self) cannot exceed 30 characters.' }),
  phoneGuardian: z.string().trim().max(30, { message: 'Phone (guardian) cannot exceed 30 characters.' }).optional().nullable(),
  bloodGroup: z.string().trim().max(10, { message: 'Blood group cannot exceed 10 characters.' }).optional().nullable(),
  schoolCollege: z.string().trim().min(1, { message: 'School/College is required and cannot be empty.' }).max(150, { message: 'School/College cannot exceed 150 characters.' }),
  photoUrl: z.string().trim().optional().nullable(),
});

export type CreateStudentInputDto = z.infer<typeof createStudentSchema>;
