import { Router } from 'express';
import courseController from '../controllers/course.controller.js';

const router = Router();

router.post('/', courseController.createCourse);

export default router;
