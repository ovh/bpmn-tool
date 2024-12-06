import { Result, ok, fail } from '../../../../shared-kernel/utils/Result';
import { validator } from '../../../../shared-kernel/validation/adapters/zod/zodValidation';

import { defaultDisplayNameConstraint } from '../../../../shared-kernel/validation/adapters/zod/defaultConstraints';

export const nameValidation = defaultDisplayNameConstraint.min(1).max(255);

export interface ResourceNameProps {
  value: string;
}

export class ResourceName {
  private props: ResourceNameProps;

  get value(): string {
    return this.props.value.trim();
  }

  set value(newValue: string) {
    this.props.value = newValue.trim();
  }

  constructor(props: ResourceNameProps) {
    this.props = props;
  }

  private static isValid(value: string): boolean {
    return Boolean(validator(value, nameValidation).ok);
  }

  public static create(value: string): Result<ResourceName, Error> {
    if (!ResourceName.isValid(value)) {
      return fail(new Error('Resource name is invalid'));
    }

    return ok(new ResourceName({ value }));
  }
}
