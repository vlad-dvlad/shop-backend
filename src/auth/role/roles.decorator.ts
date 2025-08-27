import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/types';

export const Roles = (...args: UserRole[]) => SetMetadata('roles', args);
