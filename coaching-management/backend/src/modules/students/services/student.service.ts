import prisma from '../../../config/prisma.js';
import { CreateStudentInputDto } from '../validators/student.validator.js';

export const createStudent = async (input: CreateStudentInputDto) => {
  const existingStudent = await prisma.student.findFirst({
    where: {
      roll: input.roll,
    },
  });

  if (existingStudent) {
    const error: any = new Error('A student with this roll number already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Find a fallback default user (e.g. admin or any valid user) for createdBy since authentication is disabled for students
  // const fallbackUser = await prisma.user.findFirst();
  // if (!fallbackUser) {
  //   const error: any = new Error('System user not found for record creation.');
  //   error.statusCode = 500;
  //   throw error;
  // }

  const student = await prisma.student.create({
    data: {
      fullName: input.fullName,
      roll: input.roll,
      phoneSelf: input.phoneSelf,
      phoneGuardian: input.phoneGuardian || null,
      bloodGroup: input.bloodGroup || null,
      schoolCollege: input.schoolCollege,
      photoUrl: input.photoUrl || null,
      createdBy: input.createdBy,
    },
  });

  return student;
};

export const studentService = {
  createStudent
};

export default studentService;






