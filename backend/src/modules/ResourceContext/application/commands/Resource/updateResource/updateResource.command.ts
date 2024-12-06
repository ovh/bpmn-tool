import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { NameValidator } from '../../../../../../shared-kernel/validation/adapters/class-validator/nameValidator';

export class UpdateResourceBody {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MaxLength(255)
  @NameValidator({ message: 'Name is invalid' })
  name?: string;

  description?: string;
  parentId?: string;
}

export class UpdateResourceCommand {
  resourceId: string;
  name?: string;
  description?: string;
  parentId?: string;
}
