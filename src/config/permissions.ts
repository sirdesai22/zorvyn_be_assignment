import { ROLES } from './constants';

type Resource = 'dashboard' | 'records' | 'users';
type Action = 'read' | 'write';

type Permission = {
  [key in Resource]: {
    read: boolean;
    write: boolean;
  };
};

export const PERMISSIONS: Record<string, Permission> = {
  [ROLES.VIEWER]: {
    dashboard: { read: true, write: false },
    records: { read: false, write: false },
    users: { read: false, write: false },
  },
  [ROLES.ANALYST]: {
    dashboard: { read: true, write: false },
    records: { read: true, write: false },
    users: { read: false, write: false },
  },
  [ROLES.ADMIN]: {
    dashboard: { read: true, write: true },
    records: { read: true, write: true },
    users: { read: true, write: true },
  },
};
