import { CommentTypeOrmRepository } from './typeorm/comment.repository';
import { ContentTypeOrmRepository } from './typeorm/content.repository';
import { ResourceTypeOrmRepository } from './typeorm/resource.repository';

export const getRepositories = () => [
  {
    provide: 'ResourceRepository',
    useClass: ResourceTypeOrmRepository,
  },
  {
    provide: 'ContentRepository',
    useClass: ContentTypeOrmRepository,
  },
  {
    provide: 'CommentRepository',
    useClass: CommentTypeOrmRepository,
  },
];
