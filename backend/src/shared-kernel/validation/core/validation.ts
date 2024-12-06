import { Result } from '../../../shared-kernel/utils/Result';

export type GenericValidatorResult<FormType, FormTypeError> = Result<
  FormType,
  FormTypeError
>;
