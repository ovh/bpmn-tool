import { CreateResourceCommandHandler } from './createResource/createResource.commandHandler';
import { DeleteResourceCommandHandler } from './deleteResource/deleteResource.commandHandler';
import { UpdateResourceCommandHandler } from './updateResource/updateResource.commandHandler';
import { ResourceRepository } from '../../adapters/repositories/resource.repository';

export const getResourceCommands = () => [
  {
    provide: CreateResourceCommandHandler,
    useFactory: (folderRepository: ResourceRepository) => {
      return new CreateResourceCommandHandler(folderRepository);
    },
    inject: ['ResourceRepository'],
  },
  {
    provide: UpdateResourceCommandHandler,
    useFactory: (folderRepository: ResourceRepository) => {
      return new UpdateResourceCommandHandler(folderRepository);
    },
    inject: ['ResourceRepository'],
  },
  {
    provide: DeleteResourceCommandHandler,
    useFactory: (folderRepository: ResourceRepository) => {
      return new DeleteResourceCommandHandler(folderRepository);
    },
    inject: ['ResourceRepository'],
  },
];
