import { Router } from 'express';
import { createStudent } from '../controllers/student.controller.js';

const router = Router();

router.post('/createStudent', createStudent);

export default router;

