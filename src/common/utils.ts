import { UserRole } from './types';

type AccessLevel = 'limited' | 'partial' | 'full';

export const getAccess = (access: AccessLevel) => {
  let roles: UserRole[] = [];
  switch (access) {
    case 'limited':
      roles = [UserRole.USER];
      break;
    case 'partial':
      roles = [UserRole.USER, UserRole.VENDOR];
      break;
    case 'full':
      roles = [UserRole.USER, UserRole.VENDOR, UserRole.ADMIN];
      break;
  }

  return roles;
};
