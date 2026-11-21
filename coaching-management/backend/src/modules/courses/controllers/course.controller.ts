import { Request, Response, NextFunction } from 'express';
import courseService from '../services/course.service.js';
import { createCourseSchema } from '../validators/course.validator.js';

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = createCourseSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed.',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
      });
      return;
    }

    const course = await courseService.createCourse(validationResult.data);

    res.status(201).json({
      success: true,
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const courseController = {
  createCourse,
};

export default courseController;
