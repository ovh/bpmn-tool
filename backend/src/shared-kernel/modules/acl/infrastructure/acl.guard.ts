import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { metadataKey } from './acl.decorator';
import { UserGroup } from '../../../utils/UserGroup';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const remoteUser =
      request.headers[this.configService.getOrThrow('userHeader')];

    const { allowedGroups } = this.reflector.get(
      metadataKey,
      context.getHandler(),
    );

    if (!allowedGroups || !allowedGroups?.length) {
      if (!remoteUser) {
        throw new UnauthorizedException();
      } else {
        return true;
      }
    }

    const userGroupsHeader: string | null =
      request.headers[this.configService.getOrThrow('userGroupsHeader')] ??
      null;

    if (!userGroupsHeader) {
      return false;
    }

    const userGroups = userGroupsHeader.split(',');

    return allowedGroups.some((group: UserGroup) =>
      userGroups.some((userGroup) =>
        new RegExp(`${group}-[a-z]+`).test(userGroup),
      ),
    );
  }
}
