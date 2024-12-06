import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Headers,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';

import { UserGroup } from '../../../../shared-kernel/utils/UserGroup';
import { UseAcl } from '../../../../shared-kernel/modules/acl/infrastructure/acl.decorator';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { Comment } from '../../../../modules/ResourceContext/domain/Comment/Comment';
import { CommentMapper } from '../mappers/comment.mapper';

import { ListCommentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Comment/listComment/listComment.queryHandler';

import { GetCommentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Comment/getComment/getComment.queryHandler';
import { GetCommentQuery } from '../../../../modules/ResourceContext/application/queries/Comment/getComment/getComment.query';

import { CreateCommentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Comment/createComment/createComment.commandHandler';
import { CreateCommentCommand } from '../../../../modules/ResourceContext/application/commands/Comment/createComment/createComment.command';

import { UpdateCommentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Comment/updateComment/updateComment.commandHandler';
import {
  UpdateCommentCommand,
  UpdateCommentCommandParams,
} from '../../../../modules/ResourceContext/application/commands/Comment/updateComment/updateComment.command';

import { DeleteCommentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Comment/deleteComment/deleteComment.commandHandler';
import { DeleteCommentCommandParams } from '../../../../modules/ResourceContext/application/commands/Comment/deleteComment/deleteComment.command';
import { SortCommandOrderEnum } from '../../../../shared-kernel/utils/SortCommand';
import { ConfigService } from '@nestjs/config';

type CreateCommentBody = Omit<CreateCommentCommand, 'createdBy'>;
type UpdateCommentBody = Omit<UpdateCommentCommand, 'updatedBy'>;

@Controller('resources/:resourceId/comments')
export class CommentController {
  constructor(
    private readonly configService: ConfigService,
    private readonly listCommentQueryHandler: ListCommentQueryHandler,
    private readonly getCommentQueryHandler: GetCommentQueryHandler,
    private readonly createCommentCommandHandler: CreateCommentCommandHandler,
    private readonly updateCommentCommandHandler: UpdateCommentCommandHandler,
    private readonly deleteCommentCommandHandler: DeleteCommentCommandHandler,
  ) {}

  @Get()
  @UseAcl()
  async listComment(
    @Param('resourceId') resourceId: string,
    @Query('sort.by') sortBy: string,
    @Query('sort.order') sortOrder: SortCommandOrderEnum,
  ) {
    const queryResult = await this.listCommentQueryHandler.execute(resourceId, {
      sort: {
        by: sortBy,
        order: sortOrder,
      },
    });

    if (queryResult.fail) {
      if (queryResult.fail instanceof CannotFindResourceError) {
        throw new NotFoundException(queryResult.fail.message);
      }
      if (queryResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(queryResult.fail.message);
      }
      throw queryResult.fail;
    }

    return queryResult.ok.map(CommentMapper.toPresenter);
  }

  @Get('/:commentId')
  @UseAcl()
  async getComment(@Param() params: GetCommentQuery) {
    const queryResult = await this.getCommentQueryHandler.execute(
      params.resourceId,
      params.commentId,
    );

    if (queryResult.fail) {
      if (queryResult.fail instanceof CannotFindResourceError) {
        throw new NotFoundException(queryResult.fail.message);
      }
      if (queryResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(queryResult.fail.message);
      }
      throw new BadRequestException(queryResult.fail.message);
    }

    return CommentMapper.toPresenter(queryResult.ok as Comment);
  }

  @Post()
  @UseAcl([UserGroup.RW])
  async createComment(
    @Param('resourceId') resourceId: string,
    @Body() body: CreateCommentBody,
    @Headers() headers: Record<string, string>,
  ) {
    const commandResult = await this.createCommentCommandHandler.execute({
      ...body,
      resourceId,
      createdBy: headers[this.configService.getOrThrow('userHeader')],
    });

    if (commandResult.fail) {
      if (commandResult.fail instanceof CannotFindResourceError) {
        throw new NotFoundException(commandResult.fail.message);
      }
      if (commandResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(commandResult.fail.message);
      }
      throw new BadRequestException(commandResult.fail.message);
    }

    return CommentMapper.toPresenter(commandResult.ok);
  }

  @Put('/:commentId')
  @UseAcl([UserGroup.RW])
  async updateComment(
    @Param() params: UpdateCommentCommandParams,
    @Body() body: UpdateCommentBody,
    @Headers() headers: Record<string, string>,
  ) {
    const { resourceId, commentId } = params;

    const commandResult = await this.updateCommentCommandHandler.execute(
      resourceId,
      commentId,
      {
        ...body,
        updatedBy: headers[this.configService.getOrThrow('userHeader')],
      },
    );

    if (commandResult.fail) {
      if (commandResult.fail instanceof CannotFindResourceError) {
        throw new NotFoundException(commandResult.fail.message);
      }
      if (commandResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(commandResult.fail.message);
      }
      throw new BadRequestException(commandResult.fail.message);
    }

    return CommentMapper.toPresenter(commandResult.ok);
  }

  @Delete('/:commentId')
  @UseAcl([UserGroup.RW])
  async deleteComment(@Param() params: DeleteCommentCommandParams) {
    const commandResult =
      await this.deleteCommentCommandHandler.execute(params);

    if (commandResult.fail) {
      if (commandResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(commandResult.fail.message);
      }
      throw new NotFoundException(commandResult.fail.message);
    }

    return commandResult.ok;
  }
}
