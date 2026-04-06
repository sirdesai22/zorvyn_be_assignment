import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../services/recordService';
import { createRecordRules, updateRecordRules, listRecordRules, validate } from '../validators/recordValidators';
import { AppError } from '../middleware/errorHandler';
import { ROLES } from '../config/constants';
import { RecordType } from '../types';

const router = Router();

router.use(authenticate, requireRole(ROLES.ADMIN, ROLES.ANALYST));

router.get('/', listRecordRules, validate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, category, type, page, pageSize } = req.query;
    const result = getRecords({
      startDate: startDate as string,
      endDate: endDate as string,
      category: category as string,
      type: type as RecordType,
      page: page as string,
      pageSize: pageSize as string
    });
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireRole(ROLES.ADMIN), createRecordRules, validate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const record = createRecord({ amount, type, category, date, notes, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid record ID'));
    const record = getRecordById(id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireRole(ROLES.ADMIN), updateRecordRules, validate, (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid record ID'));
    const record = updateRecord(id, req.body);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireRole(ROLES.ADMIN), (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return next(new AppError(400, 'Invalid record ID'));
    const record = deleteRecord(id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
});

export default router;
