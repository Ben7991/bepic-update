import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const preferredRoles: Array<Role> = this._reflector.get(
      Roles,
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    return preferredRoles.includes(user.role);
  }
}
