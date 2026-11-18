import prisma from '../../../config/prisma.js';
import { CreateStudentInputDto } from '../validators/student.validator.js';

export class StudentService {
  async createStudent(input: CreateStudentInputDto, actorUserId: string) {
    const batch = await prisma.academicBatch.findUnique({
      where: { id: input.academicBatchId },
    });

    if (!batch) {
      const error: any = new Error('Academic batch not found.');
      error.statusCode = 404;
      throw error;
    }

    const existingStudent = await prisma.student.findUnique({
      where: {
        roll_batch_unique: {
          roll: input.roll,
          academicBatchId: input.academicBatchId,
        },
      },
    });

    if (existingStudent) {
      const error: any = new Error('A student with this roll number already exists in the specified academic batch.');
      error.statusCode = 409;
      throw error;
    }

    const student = await prisma.student.create({
      data: {
        academicBatchId: input.academicBatchId,
        fullName: input.fullName,
        roll: input.roll,
        phoneSelf: input.phoneSelf,
        phoneGuardian: input.phoneGuardian || null,
        bloodGroup: input.bloodGroup || null,
        schoolCollege: input.schoolCollege,
        photoUrl: input.photoUrl || null,
        createdBy: actorUserId,
      },
    });

    return student;
  }
}

