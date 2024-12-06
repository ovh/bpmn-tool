import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { NameValidator } from '../../../../../../shared-kernel/validation/adapters/class-validator/nameValidator';

export class CreateResourceCommand {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(255)
  @NameValidator({ message: 'Name is invalid' })
  name: string;

  description: string;
  parentId?: string;
  createdBy: string;
  type: ResourceTypeEnum;
}
