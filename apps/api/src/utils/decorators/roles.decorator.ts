import { Reflector } from '@nestjs/core';

import { Role } from '../../auth/auth.types';

export const Roles = Reflector.createDecorator<Role[]>();
