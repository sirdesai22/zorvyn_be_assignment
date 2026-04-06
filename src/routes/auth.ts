import { Router, Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authenticateUser } from '../services/userService';
import { loginValidationRules } from '../validators/authValidators';
import { validate } from '../validators/recordValidators';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants';

const router = Router();

router.post('/login', loginValidationRules, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}` };
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      options
    );
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    next(err);
  }
});

export default router;
