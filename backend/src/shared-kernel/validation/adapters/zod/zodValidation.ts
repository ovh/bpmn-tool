import { ZodIssue } from 'zod';
import { ZodType, ZodTypeDef } from 'zod/lib/types';

import { zodConfigurator } from './zodConfig';
import { GenericValidatorResult } from '../../core/validation';
import { fail, ok } from '../../../../shared-kernel/utils/Result';

zodConfigurator();

const zodValidator = <
  FormType,
  Output = unknown,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output,
>(
  form: FormType,
  FormSchema: ZodType<Output, Def, Input>,
): GenericValidatorResult<Output, ZodIssue[]> => {
  let errors: ZodIssue[] = [];

  const validatedForm = FormSchema.safeParse(form);

  if (!validatedForm.success) {
    errors = [
      ...errors,
      ...validatedForm.error.issues.map(
        (issue) => issue.message as unknown as ZodIssue,
      ),
    ];

    return fail(errors);
  }

  return ok(validatedForm.data);
};

export const validator = zodValidator;
