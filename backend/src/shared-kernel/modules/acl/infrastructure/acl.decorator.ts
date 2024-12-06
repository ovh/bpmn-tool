import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AclGuard } from './acl.guard';
import { UserGroup } from '../../../utils/UserGroup';

export const metadataKey = 'ACL_CONTEXT';

export const UseAcl = (allowedGroups?: UserGroup[]) => {
  const decorators: Parameters<typeof applyDecorators> = [
    SetMetadata(metadataKey, { allowedGroups }),
    UseGuards(AclGuard),
  ];

  return applyDecorators(...decorators);
};
