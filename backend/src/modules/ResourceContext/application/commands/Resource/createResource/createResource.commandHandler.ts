import { fail, ok } from '../../../../../../shared-kernel/utils/Result';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ResourceName } from '../../../../../../modules/ResourceContext/domain/Resource/ResourceName';
import { ResourceRepository } from '../../../adapters/repositories/resource.repository';
import { Resource } from '../../../../domain/Resource/Resource';
import { CreateResourceCommand } from './createResource.command';
import {
  CannotCreateResourceError,
  CannotFindParentResourceError,
} from './createResource.error';
import { ResourceNameExistError } from '../resource.error';

export class CreateResourceCommandHandler {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  public async execute(
    command: CreateResourceCommand,
  ): Promise<UseCaseResult<Resource>> {
    const resourceName = new ResourceName({ value: command.name });
    let parentResource;
    let resourceNamePromise;

    // check if parent exists
    if (command.parentId) {
      const parentResourceResult = await this.resourceRepository.findOne(
        command.parentId,
      );

      if (!parentResourceResult.ok) {
        return fail(
          new CannotFindParentResourceError(parentResourceResult.fail as Error),
        );
      }

      parentResource = parentResourceResult.ok;

      resourceNamePromise = this.resourceRepository.find({
        parentId: command.parentId,
      });
    } else {
      resourceNamePromise = this.resourceRepository.findByDepth(0);
    }

    // check if no resource exists with the same name
    const resourceNameResult = await resourceNamePromise;

    if (!resourceNameResult.ok) {
      // toto: error
    }

    if (
      resourceNameResult.ok &&
      resourceNameResult.ok.some(({ name }) => name === resourceName.value)
    ) {
      return fail(
        new ResourceNameExistError({
          name: resourceName.value,
        }),
      );
    }

    const saveResult = await this.resourceRepository.save(
      Resource.apply({
        name: resourceName,
        description: command.description,
        parentId: command.parentId,
        depth: Resource.computeDepth(parentResource?.depth),
        createdBy: command.createdBy,
        type: command.type,
      }),
    );

    if (!saveResult.ok) {
      return fail(new CannotCreateResourceError(saveResult.fail));
    }

    return ok(saveResult.ok);
  }
}
