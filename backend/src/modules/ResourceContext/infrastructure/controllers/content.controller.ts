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
  Header,
} from '@nestjs/common';
import { OmitType } from '@nestjs/swagger';

import { UserGroup } from '../../../../shared-kernel/utils/UserGroup';
import { UseAcl } from '../../../../shared-kernel/modules/acl/infrastructure/acl.decorator';
import { ContentStatusEnum } from '../../../../modules/ResourceContext/shared/types/Content';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { Content } from '../../../../modules/ResourceContext/domain/Content/Content';
import { ContentMapper } from '../mappers/content.mapper';

import { ListContentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Content/listContent/listContent.queryHandler';

import { GetContentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Content/getContent/getContent.queryHandler';
import { GetContentQuery } from '../../../../modules/ResourceContext/application/queries/Content/getContent/getContent.query';

import { GetXmlContentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Content/getXmlContent/getXmlContent.queryHandler';
import { GetXmlContentQueryParams } from '../../../../modules/ResourceContext/application/queries/Content/getXmlContent/getXmlContent.query';

import { CreateContentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Content/createContent/createContent.commandHandler';
import { CreateContentCommand } from '../../../../modules/ResourceContext/application/commands/Content/createContent/createContent.command';

import { UpdateContentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Content/updateContent/udpateContent.commandHandler';
import {
  UpdateContentCommand,
  UpdateContentCommandParams,
} from '../../../../modules/ResourceContext/application/commands/Content/updateContent/updateContent.command';

import { DeleteContentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Content/deleteContent/deleteContent.commandHandler';
import { DeleteContentCommandParams } from '../../../../modules/ResourceContext/application/commands/Content/deleteContent/deleteContent.command';

import { PublishContentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Content/publishContent/publishContent.commandHandler';
import {
  PublishContentCommand,
  PublishContentCommandParams,
} from '../../../../modules/ResourceContext/application/commands/Content/publishContent/publishContent.command';

import { CloneContentCommandHandler } from '../../../../modules/ResourceContext/application/commands/Content/cloneContent/cloneContent.commandHandler';
import { CloneContentCommandParams } from '../../../../modules/ResourceContext/application/commands/Content/cloneContent/cloneContent.command';
import { CannotFindContentError } from '../../../../modules/ResourceContext/application/commands/Content/content.error';
import { DraftContentExistsError } from '../../../../modules/ResourceContext/application/commands/Content/cloneContent/cloneContent.error';
import { ConfigService } from '@nestjs/config';

type CreateContentBody = Omit<CreateContentCommand, 'createdBy'>;
type UpdateContentBody = Omit<UpdateContentCommand, 'updatedBy'>;
class PublishContentBody extends OmitType(PublishContentCommand, [
  'updatedBy',
] as const) {}

@Controller('resources/:resourceId/contents')
export class ContentController {
  constructor(
    private readonly configService: ConfigService,
    private readonly listContentQueryHandler: ListContentQueryHandler,
    private readonly getContentQueryHandler: GetContentQueryHandler,
    private readonly getXmlContentQueryHandler: GetXmlContentQueryHandler,
    private readonly createContentCommandHandler: CreateContentCommandHandler,
    private readonly updateContentCommandHandler: UpdateContentCommandHandler,
    private readonly deleteContentCommandHandler: DeleteContentCommandHandler,
    private readonly publishContentCommandHandler: PublishContentCommandHandler,
    private readonly cloneContentCommandHandler: CloneContentCommandHandler,
  ) {}

  @Get()
  @UseAcl()
  async listContent(
    @Param('resourceId') resourceId: string,
    @Query('filter.type') status: ContentStatusEnum,
  ) {
    const queryResult = await this.listContentQueryHandler.execute(resourceId, {
      filters: {
        status,
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

    return queryResult.ok.map(ContentMapper.toPresenter);
  }

  @Get('/:contentId')
  @UseAcl()
  async getContent(@Param() params: GetContentQuery) {
    const queryResult = await this.getContentQueryHandler.execute(
      params.resourceId,
      params.contentId,
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

    return ContentMapper.toPresenter(queryResult.ok as Content);
  }

  @Get('/:contentId/content')
  @Header('content-type', 'application/xml')
  @UseAcl()
  async getXmlContent(@Param() params: GetXmlContentQueryParams) {
    const queryResult = await this.getXmlContentQueryHandler.execute(
      params.resourceId,
      params.contentId,
    );

    if (queryResult.fail) {
      if (
        queryResult.fail instanceof CannotFindResourceError ||
        queryResult.fail instanceof CannotFindContentError
      ) {
        throw new NotFoundException(queryResult.fail.message);
      }
      if (queryResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(queryResult.fail.message);
      }
      throw new BadRequestException(queryResult.fail.message);
    }

    return queryResult.ok;
  }

  @Post()
  @UseAcl([UserGroup.RW])
  async createContent(
    @Param('resourceId') resourceId: string,
    @Body() body: CreateContentBody,
    @Headers() headers: Record<string, string>,
  ) {
    const commandResult = await this.createContentCommandHandler.execute({
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

    return ContentMapper.toPresenter(commandResult.ok);
  }

  @Put('/:contentId')
  @UseAcl([UserGroup.RW])
  async updateContent(
    @Param() params: UpdateContentCommandParams,
    @Body() body: UpdateContentBody,
    @Headers() headers: Record<string, string>,
  ) {
    const { resourceId, contentId } = params;

    const commandResult = await this.updateContentCommandHandler.execute(
      resourceId,
      contentId,
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

    return ContentMapper.toPresenter(commandResult.ok);
  }

  @Delete('/:contentId')
  @UseAcl([UserGroup.RW])
  async deleteContent(@Param() params: DeleteContentCommandParams) {
    const commandResult =
      await this.deleteContentCommandHandler.execute(params);

    if (commandResult.fail) {
      if (commandResult.fail instanceof BadResourceTypeError) {
        throw new ForbiddenException(commandResult.fail.message);
      }
      throw new NotFoundException(commandResult.fail.message);
    }

    return commandResult.ok;
  }

  @Post('/:contentId/publish')
  @UseAcl([UserGroup.RW])
  async publishContent(
    @Param() params: PublishContentCommandParams,
    @Body() body: PublishContentBody,
    @Headers() headers: Record<string, string>,
  ) {
    const { resourceId, contentId } = params;

    const commandResult = await this.publishContentCommandHandler.execute(
      resourceId,
      contentId,
      {
        updatedBy: headers[this.configService.getOrThrow('userHeader')],
        pngContent: body.pngContent,
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

    return ContentMapper.toPresenter(commandResult.ok);
  }

  @Post('/:contentId/clone')
  @UseAcl([UserGroup.RW])
  async cloneContent(
    @Param() params: CloneContentCommandParams,
    @Headers() headers: Record<string, string>,
  ) {
    const { resourceId, contentId } = params;

    const commandResult = await this.cloneContentCommandHandler.execute(
      resourceId,
      contentId,
      {
        clonedBy: headers[this.configService.getOrThrow('userHeader')],
      },
    );

    if (commandResult.fail) {
      if (commandResult.fail instanceof CannotFindResourceError) {
        throw new NotFoundException(commandResult.fail.message);
      }
      if (
        commandResult.fail instanceof BadResourceTypeError ||
        commandResult.fail instanceof DraftContentExistsError
      ) {
        throw new ForbiddenException(commandResult.fail.message);
      }
      throw new BadRequestException(commandResult.fail.message);
    }

    return ContentMapper.toPresenter(commandResult.ok);
  }
}
