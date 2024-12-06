import { CommentRepository } from '../../adapters/repositories/comment.repository';
import { ResourceRepository } from '../../adapters/repositories/resource.repository';

import { CreateCommentCommandHandler } from './createComment/createComment.commandHandler';
import { DeleteCommentCommandHandler } from './deleteComment/deleteComment.commandHandler';
import { UpdateCommentCommandHandler } from './updateComment/updateComment.commandHandler';

export const getCommentCommands = () => [
  {
    provide: CreateCommentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      commentRepository: CommentRepository,
    ) => {
      return new CreateCommentCommandHandler(
        resourceRepository,
        commentRepository,
      );
    },
    inject: ['ResourceRepository', 'CommentRepository'],
  },
  {
    provide: UpdateCommentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      commentRepository: CommentRepository,
    ) => {
      return new UpdateCommentCommandHandler(
        resourceRepository,
        commentRepository,
      );
    },
    inject: ['ResourceRepository', 'CommentRepository'],
  },
  {
    provide: DeleteCommentCommandHandler,
    useFactory: (
      resourceRepository: ResourceRepository,
      commentRepository: CommentRepository,
    ) => {
      return new DeleteCommentCommandHandler(
        resourceRepository,
        commentRepository,
      );
    },
    inject: ['ResourceRepository', 'CommentRepository'],
  },
];
