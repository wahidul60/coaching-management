import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { authorize } from '../../../middleware/rbac.middleware.js';

const router = Router();

router.post('/login', (req, res, next) => {
  authController.login(req, res, next);
});

router.get('/me', authenticate, (req, res, next) => {
  authController.me(req, res, next);
});

router.post('/users', authenticate, authorize(['ADMIN']), (req, res, next) => {
  authController.createUser(req, res, next);
});

export default router;

