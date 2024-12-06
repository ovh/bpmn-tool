import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ResourceRepository } from '../../../adapters/repositories/resource.repository';
import { DeleteResourceCommand } from './deleteResource.command';
import { CannotDeleteResourceError } from './deleteResource.error';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';

export class DeleteResourceCommandHandler {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  public async execute(
    command: DeleteResourceCommand,
  ): Promise<UseCaseResult<boolean>> {
    const deleteResult = await this.resourceRepository.delete(
      command.resourceId,
    );

    if (!deleteResult.ok) {
      return fail(new CannotDeleteResourceError(deleteResult.fail as Error));
    }

    return ok(deleteResult.ok);
  }
}
