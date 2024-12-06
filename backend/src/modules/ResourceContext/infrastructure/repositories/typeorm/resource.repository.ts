import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

import {
  Result,
  combineResults,
  ok,
  fail,
} from '../../../../../shared-kernel/utils/Result';
import { Maybe } from '../../../../../shared-kernel/utils/Maybe';
import { ResourceTypeOrmEntity } from '../../../../../modules/ResourceContext/infrastructure/entities/resource.ormEntity';
import {
  ResourceFilters,
  ResourceRepository,
} from '../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Resource } from '../../../../../modules/ResourceContext/domain/Resource/Resource';
import { ResourceMapper } from '../../mappers/resource.mapper';

@Injectable()
export class ResourceTypeOrmRepository implements ResourceRepository {
  private readonly logger = new Logger(ResourceTypeOrmRepository.name);

  constructor(
    @InjectRepository(ResourceTypeOrmEntity)
    private readonly resourceRepository: Repository<ResourceTypeOrmEntity>,
  ) {}

  async save(resource: Resource): Promise<Result<Resource, Error>> {
    try {
      const resourceEntity = ResourceMapper.toPersistence(resource);
      const savedResource = await this.resourceRepository.save(resourceEntity);
      return ResourceMapper.fromPersistence(savedResource);
    } catch (error) {
      const errorMsg = 'Error while saving resource';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async delete(resourceId: string): Promise<Result<boolean, Error>> {
    try {
      const deletedResource = await this.resourceRepository
        .createQueryBuilder('resources')
        .delete()
        .from(ResourceTypeOrmEntity)
        .where('id = :id', { id: resourceId })
        .orWhere('parentId = :parentId', { parentId: resourceId })
        .execute();

      if (!deletedResource?.affected || deletedResource.affected < 1) {
        return fail(new Error('Error while deleting resource'));
      }

      return ok(true);
    } catch (error) {
      const errorMsg = 'Error while deleting resource';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async findOne(resourceId: string): Promise<Result<Maybe<Resource>, Error>> {
    try {
      const queryResult = await this.resourceRepository.findOneBy({
        id: resourceId,
      });

      if (!queryResult) {
        return fail(new Error(`Can't find resource with id ${resourceId}`));
      }

      return ResourceMapper.fromPersistence(queryResult);
    } catch (error) {
      const errorMsg = `Error while getting resource id ${resourceId}`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async find(
    filters?: ResourceFilters,
  ): Promise<Result<Resource[], Error | Error[]>> {
    try {
      const result = await this.resourceRepository.find(
        filters && Object.keys(filters).length
          ? {
              where: filters,
            }
          : {},
      );

      return combineResults(result.map(ResourceMapper.fromPersistence));
    } catch (error) {
      const errorMsg = 'Error while finding resources';
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }

  async findByDepth(
    depth: number,
  ): Promise<Result<Resource[], Error | Error[]>> {
    try {
      const queryResult = await this.resourceRepository.findBy({
        depth,
      });

      return combineResults(queryResult.map(ResourceMapper.fromPersistence));
    } catch (error) {
      const errorMsg = `Error while getting resources with depth '${depth}'`;
      this.logger.error(`${errorMsg}:`, error);
      return fail(new Error(errorMsg));
    }
  }
}
