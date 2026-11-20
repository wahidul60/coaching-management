import { Request, Response, NextFunction } from 'express';
import studentService from '../services/student.service.js';
import { createStudentSchema } from '../validators/student.validator.js';

export const createStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = createStudentSchema.safeParse(req.body);

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

    const student = await studentService.createStudent(validationResult.data);

    res.status(201).json({
      success: true,
      data: {
        student,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const studentController = {
  createStudent,
};


