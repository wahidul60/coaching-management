import prisma from '../../../config/prisma.js';
import { CreateCourseInputDto } from '../validators/course.validator.js';

export const createCourse = async (input: CreateCourseInputDto) => {
  const existingCourse = await prisma.course.findUnique({
    where: {
      name: input.name,
    },
  });

  if (existingCourse) {
    const error: any = new Error('A course with this name already exists.');
    error.statusCode = 409;
    throw error;
  }

  const category = await prisma.courseCategory.findUnique({
    where: {
      id: input.categoryId,
    },
  });

  if (!category) {
    const error: any = new Error('Course category not found.');
    error.statusCode = 404;
    throw error;
  }

  const course = await prisma.course.create({
    data: {
      name: input.name,
      categoryId: input.categoryId,
      fee: input.fee,
      description: input.description || null,
      isActive: input.isActive ?? true,
      createdBy: input.createdBy,
    },
  });

  return course;
};

export const courseService = {
  createCourse,
};

export default courseService;
