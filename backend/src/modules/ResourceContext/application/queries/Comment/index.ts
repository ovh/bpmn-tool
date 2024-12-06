import { ListCommentQueryHandler } from './listComment/listComment.queryHandler';
import { ResourceRepository } from '../../adapters/repositories/resource.repository';
import { CommentRepository } from '../../adapters/repositories/comment.repository';
import { GetCommentQueryHandler } from './getComment/getComment.queryHandler';

export const getCommentQueries = () => [
  {
    provide: ListCommentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      commentRepository: CommentRepository,
    ) => {
      return new ListCommentQueryHandler(resourceRepository, commentRepository);
    },
    inject: ['ResourceRepository', 'CommentRepository'],
  },
  {
    provide: GetCommentQueryHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      commentRepository: CommentRepository,
    ) => {
      return new GetCommentQueryHandler(resourceRepository, commentRepository);
    },
    inject: ['ResourceRepository', 'CommentRepository'],
  },
];
