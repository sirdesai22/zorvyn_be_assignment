import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { getUsers, getUserById, createUser, updateUser, deactivateUser } from '../services/userService';
import { createUserRules, updateUserRules } from '../validators/userValidators';
import { validate } from '../validators/recordValidators';
import { AppError } from '../middleware/errorHandler';
import { ROLES } from '../config/constants';

const router = Router();

router.use(authenticate, requireRole(ROLES.ADMIN));

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, status } = req.query;
    const users = getUsers({ role: role as string, status: status as string });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/', createUserRules, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role, status } = req.body;
    const user = await createUser({ username, password, role, status });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid user ID'));
    const user = getUserById(id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', updateUserRules, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid user ID'));
    const user = await updateUser(id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid user ID'));
    if (req.user!.id === id) return next(new AppError(400, 'Cannot deactivate your own account'));
    const user = deactivateUser(id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
