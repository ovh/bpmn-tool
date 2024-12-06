import { ListContentQueryHandler } from './listContent/listContent.queryHandler';
import { ResourceRepository } from '../../adapters/repositories/resource.repository';
import { ContentRepository } from '../../adapters/repositories/content.repository';
import { GetContentQueryHandler } from './getContent/getContent.queryHandler';
import { GetXmlContentQueryHandler } from './getXmlContent/getXmlContent.queryHandler';
import { GetPublishedContentQueryHandler } from './getPublishedContent/getPublishedContent.queryHandler';

export const getContentQueries = () => [
  {
    provide: ListContentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new ListContentQueryHandler(resourceRepository, contentRepository);
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: GetContentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new GetContentQueryHandler(resourceRepository, contentRepository);
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: GetXmlContentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new GetXmlContentQueryHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
  {
    provide: GetPublishedContentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      contentRepository: ContentRepository,
    ) => {
      return new GetPublishedContentQueryHandler(
        resourceRepository,
        contentRepository,
      );
    },
    inject: ['ResourceRepository', 'ContentRepository'],
  },
];
