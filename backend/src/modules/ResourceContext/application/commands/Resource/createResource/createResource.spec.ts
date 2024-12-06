import { CreateResourceCommandHandler } from './createResource.commandHandler';
import { ResourceStubRepository } from '../../../../infrastructure/repositories/stubs/resource.stubRepository';
import { Resource } from '../../../../domain/Resource/Resource';
import { ResourceName } from '../../../../../../modules/ResourceContext/domain/Resource/ResourceName';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { Uuid } from '../../../../../../shared-kernel/utils/Uuid';

describe('Resource Creation', () => {
  const setup = () => {
    const resourceRepository = new ResourceStubRepository();
    const createResourceCommandHandler = new CreateResourceCommandHandler(
      resourceRepository,
    );
    return {
      resourceRepository,
      createResourceCommandHandler,
    };
  };

  const resourceList = [
    new Resource(
      {
        name: new ResourceName({ value: 'ROOT FOLDER' }),
        description: '',
        depth: 0,
        type: ResourceTypeEnum.Folder,
        createdBy: 'jest-test',
      },
      new Uuid('a4e84766-0955-4e01-9bac-75f199cb1580'),
    ),
    new Resource({
      name: new ResourceName({ value: 'DEPTH 1 FOLDER' }),
      description: '',
      depth: 1,
      parentId: '1',
      type: ResourceTypeEnum.Folder,
      createdBy: 'jest-test',
    }),
    new Resource({
      name: new ResourceName({ value: 'DEPTH 2 FOLDER' }),
      description: '',
      depth: 2,
      parentId: '2',
      type: ResourceTypeEnum.Folder,
      createdBy: 'jest-test',
    }),
  ];

  const resourceProps = [
    {
      id: 'a4e84766-0955-4e01-9bac-75f199cb1580',
      name: 'ROOT FOLDER',
      description: '',
      parentId: undefined,
      type: ResourceTypeEnum.Folder,
      createdBy: 'jest-test',
    },
    {
      name: 'DEPTH 1 FOLDER',
      description: '',
      parentId: 'a4e84766-0955-4e01-9bac-75f199cb1580',
      type: ResourceTypeEnum.Folder,
      createdBy: 'jest-test',
    },
    {
      name: 'DEPTH 2 FOLDER',
      description: '',
      parentId: '2',
      type: ResourceTypeEnum.Folder,
      createdBy: 'jest-test',
    },
  ];

  const validCases = [
    {
      name: 'Root resource',
      initialResources: [] as Resource[],
      newResource: resourceProps[0],
      expectedDepth: 0,
      expectedResourceListLength: 1,
    },
    {
      name: 'Depth 1 resource',
      initialResources: [resourceList[0]],
      newResource: resourceProps[1],
      expectedDepth: 1,
      expectedResourceListLength: 2,
    },
  ];

  it.each(validCases)(
    '$name should have depth $expectedDepth',
    async ({
      initialResources,
      newResource,
      expectedDepth,
      expectedResourceListLength,
    }) => {
      const { resourceRepository, createResourceCommandHandler } = setup();
      await Promise.all(
        initialResources.map((resource) => resourceRepository.save(resource)),
      );

      const saveResult =
        await createResourceCommandHandler.execute(newResource);
      const newResourceId = saveResult?.ok?.id.value as string;

      expect(Object.values(resourceRepository.resources).length).toEqual(
        expectedResourceListLength,
      );
      expect(resourceRepository.resources[newResourceId].depth).toEqual(
        expectedDepth,
      );
    },
  );
});
