import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import { CommentRepository } from '../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import { Comment } from '../../../../../modules/ResourceContext/domain/Comment/Comment';
import {
  Result,
  combineResults,
  fail,
  ok,
} from '../../../../../shared-kernel/utils/Result';
import { CommentMapper } from '../../mappers/comment.mapper';
import { CommentTypeOrmEntity } from '../../entities/comment.ormEntity';

import type { SortCommand } from '../../../../../shared-kernel/utils/SortCommand';

@Injectable()
export class CommentTypeOrmRepository implements CommentRepository {
  private readonly logger = new Logger(CommentTypeOrmRepository.name);

  constructor(
    @InjectRepository(CommentTypeOrmEntity)
    private readonly commentRepository: Repository<CommentTypeOrmEntity>,
  ) {}

  async save(comment: Comment): Promise<Result<Comment, Error>> {
    try {
      const commentEntity = CommentMapper.toPersistence(comment);
      const savedComment = await this.commentRepository.save(commentEntity);
      return CommentMapper.fromPersistence(savedComment);
    } catch (error) {
      const errorMsg = 'Error while saving comment';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async delete(commentId: string): Promise<Result<boolean, Error>> {
    try {
      const deletedResource = await this.commentRepository.delete({
        id: commentId,
      });

      if (!deletedResource?.affected || deletedResource.affected < 1) {
        return fail(new Error('Error while deleting comment'));
      }

      return ok(true);
    } catch (error) {
      const errorMsg = 'Error while deleting comment';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async findOne(commentId: string): Promise<Result<Comment, Error>> {
    try {
      const queryResult = await this.commentRepository.findOneBy({
        id: commentId,
      });

      if (!queryResult) {
        return fail(new Error(`Can't find comment with id ${commentId}`));
      }

      return CommentMapper.fromPersistence(queryResult);
    } catch (error) {
      const errorMsg = `Error while getting comment id ${commentId}`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async find(
    resourceId: string,
    sort?: SortCommand,
  ): Promise<Result<Comment[], Error | Error[]>> {
    try {
      const queryResult = await this.commentRepository.find({
        where: { resourceId },
        order: { [sort?.by || 'createdAt']: sort?.order || 'ASC' },
      });

      return combineResults(queryResult.map(CommentMapper.fromPersistence));
    } catch (error) {
      const errorMsg = `Error while finding comments for resourceId '${resourceId}'`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }
}
