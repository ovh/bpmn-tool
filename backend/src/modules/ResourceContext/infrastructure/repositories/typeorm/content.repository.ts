import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import {
  ContentFilters,
  ContentRepository,
} from '../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { Content } from '../../../../../modules/ResourceContext/domain/Content/Content';
import {
  Result,
  combineResults,
  fail,
  ok,
} from '../../../../../shared-kernel/utils/Result';
import { ContentMapper } from '../../mappers/content.mapper';
import { ContentTypeOrmEntity } from '../../entities/content.ormEntity';
import { ContentStatusEnum } from '../../../../../modules/ResourceContext/shared/types/Content';

import type { Maybe } from '../../../../../shared-kernel/utils/Maybe';
import { SortCommand } from '../../../../../shared-kernel/utils/SortCommand';

@Injectable()
export class ContentTypeOrmRepository implements ContentRepository {
  private readonly logger = new Logger(ContentTypeOrmRepository.name);

  constructor(
    @InjectRepository(ContentTypeOrmEntity)
    private readonly contentRepository: Repository<ContentTypeOrmEntity>,
  ) {}

  async save(content: Content): Promise<Result<Content, Error>> {
    try {
      const contentEntity = ContentMapper.toPersistence(content);
      const savedContent = await this.contentRepository.save(contentEntity);
      return ContentMapper.fromPersistence(savedContent);
    } catch (error) {
      const errorMsg = 'Error while saving content';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async delete(contentId: string): Promise<Result<boolean, Error>> {
    try {
      const deletedResource = await this.contentRepository.delete({
        id: contentId,
      });

      if (!deletedResource?.affected || deletedResource.affected < 1) {
        return fail(new Error('Error while deleting content'));
      }

      return ok(true);
    } catch (error) {
      const errorMsg = 'Error while deleting content';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async findOne(contentId: string): Promise<Result<Content, Error>> {
    try {
      const queryResult = await this.contentRepository.findOneBy({
        id: contentId,
      });

      if (!queryResult) {
        return fail(new Error(`Can't find content with id ${contentId}`));
      }

      return ContentMapper.fromPersistence(queryResult);
    } catch (error) {
      const errorMsg = `Error while getting content id ${contentId}`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async findOneBy(filters: {
    resourceId: string;
    status: ContentStatusEnum;
  }): Promise<Result<Maybe<Content>, Error>> {
    try {
      const queryResult = await this.contentRepository.findOneBy({
        resourceId: filters.resourceId,
        status: filters.status,
      });

      if (!queryResult) {
        return ok(null);
      }

      return ContentMapper.fromPersistence(queryResult);
    } catch (error) {
      const errorMsg = `Error while getting content by`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async find(
    resourceId: string,
    filters?: ContentFilters,
    sort?: SortCommand,
  ): Promise<Result<Content[], Error | Error[]>> {
    try {
      const whereFilters = filters?.status
        ? {
            status: filters.status,
          }
        : {};

      const queryResult = await this.contentRepository.find({
        where: {
          resourceId,
          ...whereFilters,
        },
        order: { [sort?.by || 'version']: sort?.order || 'DESC' },
      });

      return combineResults(queryResult.map(ContentMapper.fromPersistence));
    } catch (error) {
      const errorMsg = `Error while finding contents for resourceId '${resourceId}'`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }
}
