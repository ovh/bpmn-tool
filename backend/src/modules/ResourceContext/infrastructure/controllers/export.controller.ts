import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import { Readable } from 'stream';

import { GetPublishedContentQueryHandler } from '../../../../modules/ResourceContext/application/queries/Content/getPublishedContent/getPublishedContent.queryHandler';
import { GetPublishedContentQueryParams } from '../../../../modules/ResourceContext/application/queries/Content/getPublishedContent/getPublishedContent.query';

import { GetResourceQueryHandler } from '../../../../modules/ResourceContext/application/queries/Resource/getResource/getResource.queryHandler';

import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../modules/ResourceContext/application/shared/Resource/resource.error';

type ExportPngParams = GetPublishedContentQueryParams;

@Controller()
export class ExportController {
  constructor(
    private readonly getPublishedContentQueryHandler: GetPublishedContentQueryHandler,
    private readonly getResourceQueryHandler: GetResourceQueryHandler,
  ) {}

  @Get('/export/:resourceId.png')
  @Header('Content-Type', 'image/png')
  async exportPng(
    @Param() params: ExportPngParams,
    @Query('authToken') authToken?: string,
  ): Promise<any> {
    if (!authToken) {
      throw new UnauthorizedException('No token found');
    }

    const queryResult = await this.getPublishedContentQueryHandler.execute(
      params.resourceId,
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

    if (!queryResult.ok) {
      throw new NotFoundException(new Error('Cannot find published content'));
    }

    const content = queryResult.ok;

    // check if token are equals
    const getResourceQueryResult = await this.getResourceQueryHandler.execute({
      resourceId: content.state.resourceId,
    });

    if (getResourceQueryResult.fail) {
      throw new BadRequestException(getResourceQueryResult.fail.message);
    }

    const resoure = getResourceQueryResult.ok;

    if (resoure?.authToken !== authToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const stream = Readable.from(content.state.pngContent!);
    return new StreamableFile(stream);
  }
}
