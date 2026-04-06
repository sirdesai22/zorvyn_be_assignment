import { User, FinancialRecord } from '../types';

interface Store {
  users: User[];
  records: FinancialRecord[];
  nextUserId: number;
  nextRecordId: number;
}

export const store: Store = {
  users: [],
  records: [],
  nextUserId: 1,
  nextRecordId: 1,
};
