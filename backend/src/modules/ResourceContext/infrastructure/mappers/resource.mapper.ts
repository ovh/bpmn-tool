import { Result, fail, ok } from '../../../../shared-kernel/utils/Result';
import { Resource } from '../../../../modules/ResourceContext/domain/Resource/Resource';
import { ResourceName } from '../../../../modules/ResourceContext/domain/Resource/ResourceName';
import { ResourceTypeOrmEntity } from '../entities/resource.ormEntity';
import { Uuid } from '../../../../shared-kernel/utils/Uuid';
import { ResourcePresenter } from '../presenters/resource.presenter';

export class ResourceMapper {
  static fromPersistence(
    source: ResourceTypeOrmEntity,
  ): Result<Resource, Error> {
    const nameResult = ResourceName.create(source.name);

    if (!nameResult.ok) {
      return fail(nameResult.fail);
    }

    return ok(
      Resource.apply(
        {
          name: nameResult.ok,
          description: source.description,
          parentId: source.parentId,
          depth: source.depth,
          type: source.type,
          createdBy: source.createdBy,
          authToken: source.authToken,
        },
        new Uuid(source.id),
      ),
    );
  }

  static toPersistence(source: Resource): ResourceTypeOrmEntity {
    const resourceEntity = new ResourceTypeOrmEntity();

    resourceEntity.id = source.id.value;
    resourceEntity.name = source.name;
    resourceEntity.description = source.description;
    resourceEntity.depth = source.depth;
    resourceEntity.parentId = source.parentId;
    resourceEntity.type = source.type;
    resourceEntity.createdBy = source.createdBy;
    resourceEntity.authToken = source.authToken;

    return resourceEntity;
  }

  static toPresenter(source: Resource): ResourcePresenter {
    const resourcePresenter = new ResourcePresenter();

    resourcePresenter.id = source.id.value;
    resourcePresenter.name = source.name;
    resourcePresenter.description = source.description;
    resourcePresenter.depth = source.depth;
    resourcePresenter.parentId = source.parentId;
    resourcePresenter.type = source.type;
    resourcePresenter.createdBy = source.createdBy;
    resourcePresenter.authToken = source.authToken;

    return resourcePresenter;
  }
}
