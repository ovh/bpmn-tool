import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { ResourceRepository } from '../../../adapters/repositories/resource.repository';
import { UpdateResourceCommand } from './updateResource.command';
import { Resource } from '../../../../../../modules/ResourceContext/domain/Resource/Resource';
import {
  CannotFindResourceError,
  CannotSaveResourceError,
} from './updateResource.error';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ResourceNameExistError } from '../resource.error';

export class UpdateResourceCommandHandler {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  public async execute(
    command: UpdateResourceCommand,
  ): Promise<UseCaseResult<Resource>> {
    const findResourceResult = await this.resourceRepository.findOne(
      command.resourceId,
    );

    if (!findResourceResult.ok) {
      return fail(
        new CannotFindResourceError(
          command.resourceId,
          findResourceResult.fail as Error,
        ),
      );
    }

    const resource = findResourceResult.ok;

    // check if no resource exists with the same name on same depth
    if (command.name && command.name !== resource.name) {
      let resourceNamePromise;

      if (resource.parentId) {
        resourceNamePromise = this.resourceRepository.find({
          parentId: resource.parentId,
        });
      } else {
        resourceNamePromise = this.resourceRepository.findByDepth(0);
      }

      const resourceNameResult = await resourceNamePromise;

      if (!resourceNameResult.ok) {
        // toto: error
      }

      if (
        resourceNameResult.ok &&
        resourceNameResult.ok.some(({ name }) => name === command.name)
      ) {
        return fail(
          new ResourceNameExistError({
            name: command.name,
          }),
        );
      }
    }

    if (command.name) {
      resource.rename(command.name);
    }

    if (command.description !== undefined) {
      resource.changeDescription(command.description);
    }

    const result = await this.resourceRepository.save(resource);

    if (!result.ok) {
      return fail(new CannotSaveResourceError(command.resourceId, result.fail));
    }

    return ok(result.ok);
  }
}
