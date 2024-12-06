import { registerDecorator, ValidationOptions } from 'class-validator';

import { validator } from '../../../../shared-kernel/validation/adapters/zod/zodValidation';
import { defaultDisplayNameConstraint } from '../../../../shared-kernel/validation/adapters/zod/defaultConstraints';

export const NameValidator = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'nameValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return Boolean(validator(value, defaultDisplayNameConstraint).ok);
        },
      },
    });
  };
};
