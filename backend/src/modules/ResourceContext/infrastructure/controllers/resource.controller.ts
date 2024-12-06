import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Headers,
  ConflictException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UseAcl } from '../../../../shared-kernel/modules/acl/infrastructure/acl.decorator';
import { UserGroup } from '../../../../shared-kernel/utils/UserGroup';
import { ResourceMapper } from '../mappers/resource.mapper';

import { CreateResourceCommandHandler } from '../../application/commands/Resource/createResource/createResource.commandHandler';
import { CreateResourceCommand } from '../../application/commands/Resource/createResource/createResource.command';

import { ListResourceQueryHandler } from '../../application/queries/Resource/listResource/listResource.queryHandler';

import { DeleteResourceCommandHandler } from '../../application/commands/Resource/deleteResource/deleteResource.commandHandler';
import { DeleteResourceCommand } from '../../application/commands/Resource/deleteResource/deleteResource.command';

import { UpdateResourceCommandHandler } from '../../application/commands/Resource/updateResource/updateResource.commandHandler';
import {
  UpdateResourceBody,
  UpdateResourceCommand,
} from '../../application/commands/Resource/updateResource/updateResource.command';

import { GetResourceQueryHandler } from '../../application/queries/Resource/getResource/getResource.queryHandler';
import { GetResourceQuery } from '../../application/queries/Resource/getResource/getResource.query';

import { ResourceTypeEnum } from '../../../../modules/ResourceContext/shared/types/Resource';
import { ResourceNameExistError } from '../../../../modules/ResourceContext/application/commands/Resource/resource.error';
import { ConfigService } from '@nestjs/config';

@Controller('resources')
export class ResourceController {
  constructor(
    private readonly configService: ConfigService,
    private readonly createResourceCommandHandler: CreateResourceCommandHandler,
    private readonly updateResourceCommandHandler: UpdateResourceCommandHandler,
    private readonly deleteResourceCommandHandler: DeleteResourceCommandHandler,
    private readonly listResourceCommandHandler: ListResourceQueryHandler,
    private readonly getResourceQueryHandler: GetResourceQueryHandler,
  ) {}

  @Get()
  @UseAcl()
  async listResource(
    @Query('filter.type') type: ResourceTypeEnum,
    @Query('filter.depth') depth: number,
    @Query('filter.parentId') parentId: string,
  ) {
    const resourcesResult = await this.listResourceCommandHandler.execute({
      filters: {
        type,
        depth,
        parentId,
      },
    });

    if (!resourcesResult.ok) {
      throw resourcesResult.fail;
    }

    return resourcesResult.ok.map(ResourceMapper.toPresenter);
  }

  @Get('/:resourceId')
  @UseAcl()
  async getResource(@Param() params: GetResourceQuery) {
    const resourceResult = await this.getResourceQueryHandler.execute(params);

    if (!resourceResult.ok) {
      throw new NotFoundException(
        `Cannot find resource with id ${params.resourceId}`,
      );
    }

    return ResourceMapper.toPresenter(resourceResult.ok);
  }

  @Post()
  @UseAcl([UserGroup.RW])
  async createResource(
    @Body() createResourceCommand: CreateResourceCommand,
    @Headers() headers: Record<string, string>,
  ) {
    const createResourceResult =
      await this.createResourceCommandHandler.execute({
        ...createResourceCommand,
        createdBy: headers[this.configService.getOrThrow('userHeader')],
      });

    if (!createResourceResult.ok) {
      if (createResourceResult.fail instanceof ResourceNameExistError) {
        throw new ConflictException(createResourceResult.fail.message);
      }
      throw new BadRequestException(createResourceResult.fail.message);
    }

    return ResourceMapper.toPresenter(createResourceResult.ok);
  }

  @Put('/:resourceId')
  @UseAcl([UserGroup.RW])
  async updateResource(
    @Param() params: Pick<UpdateResourceCommand, 'resourceId'>,
    @Body() updateResourceCommand: UpdateResourceBody,
  ) {
    const updateResult = await this.updateResourceCommandHandler.execute({
      ...updateResourceCommand,
      resourceId: params.resourceId,
    });

    if (updateResult.fail) {
      if (updateResult.fail instanceof ResourceNameExistError) {
        throw new ConflictException(updateResult.fail.message);
      }
      throw new BadRequestException(updateResult.fail.message);
    }

    return ResourceMapper.toPresenter(updateResult.ok);
  }

  @Delete('/:resourceId')
  @UseAcl([UserGroup.RW])
  async deleteResource(@Param() deleteResourceCommand: DeleteResourceCommand) {
    const deleteResult = await this.deleteResourceCommandHandler.execute(
      deleteResourceCommand,
    );

    if (!deleteResult.ok) {
      throw new NotFoundException();
    }

    return deleteResult.ok;
  }
}
