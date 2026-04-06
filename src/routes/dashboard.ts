import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { getSummary, getCategoryBreakdown, getRecent, getMonthlyTrends } from '../services/dashboardService';

const router = Router();

router.use(authenticate);

router.get('/summary', (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: getSummary() });
  } catch (err) {
    next(err);
  }
});

router.get('/category-breakdown', (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ success: true, data: getCategoryBreakdown() });
  } catch (err) {
    next(err);
  }
});

router.get('/recent', (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit || 10;
    res.json({ success: true, data: getRecent(limit as string | number) });
  } catch (err) {
    next(err);
  }
});

router.get('/monthly-trends', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year } = req.query;
    res.json({ success: true, data: getMonthlyTrends(year as string | undefined) });
  } catch (err) {
    next(err);
  }
});

export default router;
