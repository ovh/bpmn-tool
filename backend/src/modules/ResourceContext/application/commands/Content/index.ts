import { ContentRepository } from '../../adapters/repositories/content.repository';
import { ResourceRepository } from '../../adapters/repositories/resource.repository';

import { CreateContentCommandHandler } from './createContent/createContent.commandHandler';
import { DeleteContentCommandHandler } from './deleteContent/deleteContent.commandHandler';
import { UpdateContentCommandHandler } from './updateContent/udpateContent.commandHandler';
import { PublishContentCommandHandler } from './publishContent/publishContent.commandHandler';
import { CloneContentCommandHandler } from './cloneContent/cloneContent.commandHandler';

export const getContentCommands = () => [
  {
    provide: CreateContentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new CreateContentCommandHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: UpdateContentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new UpdateContentCommandHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: DeleteContentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new DeleteContentCommandHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: PublishContentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new PublishContentCommandHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: CloneContentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new CloneContentCommandHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
];
