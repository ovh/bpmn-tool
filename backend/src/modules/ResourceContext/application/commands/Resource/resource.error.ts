import { UseCaseError } from '../../../../../shared-kernel/application/usecases/useCaseError';

export class ResourceNameExistError extends UseCaseError {
  constructor({ name }: { name: string }) {
    super(`A resource with name '${name}' already exists in parent.`);
  }
}
