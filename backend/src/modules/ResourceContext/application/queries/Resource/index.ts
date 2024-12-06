import { ResourceRepository } from '../../adapters/repositories/resource.repository';
import { GetResourceQueryHandler } from './getResource/getResource.queryHandler';
import { ListResourceQueryHandler } from './listResource/listResource.queryHandler';

export const getResourceQueries = () => [
  {
    provide: ListResourceQueryHandler,
    useFactory: (resourceRepository: ResourceRepository) => {
      return new ListResourceQueryHandler(resourceRepository);
    },
    inject: ['ResourceRepository'],
  },
  {
    provide: GetResourceQueryHandler,
    useFactory: (resourceRepository: ResourceRepository) => {
      return new GetResourceQueryHandler(resourceRepository);
    },
    inject: ['ResourceRepository'],
  },
];
