import { Content } from '../../../../modules/ResourceContext/domain/Content/Content';
import { ContentPresenter } from '../presenters/content.presenter';
import { ContentTypeOrmEntity } from '../entities/content.ormEntity';
import { Result, ok } from '../../../../shared-kernel/utils/Result';
import { Uuid } from '../../../../shared-kernel/utils/Uuid';

export class ContentMapper {
  static fromPersistence(source: ContentTypeOrmEntity): Result<Content, Error> {
    return ok(
      Content.apply(
        {
          resourceId: source.resourceId,
          content: source.content,
          pngContent: source.pngContent,
          version: source.version || undefined,
          status: source.status,
          createdBy: source.createdBy,
          createdAt: source.createdAt,
          updatedBy: source.updatedBy,
          updatedAt: source.updatedAt,
        },
        new Uuid(source.id),
      ),
    );
  }

  static toPersistence(source: Content): ContentTypeOrmEntity {
    const contentEntity = new ContentTypeOrmEntity();

    contentEntity.id = source.id.value;
    contentEntity.resourceId = source.state.resourceId;
    contentEntity.content = source.state.content;
    contentEntity.createdBy = source.state.createdBy;

    if (source.state.pngContent !== undefined) {
      contentEntity.pngContent = source.state.pngContent;
    }
    if (source.state.createdAt) {
      contentEntity.createdAt = source.state.createdAt;
    }
    if (source.state.status) {
      contentEntity.status = source.state.status;
    }
    if (source.state.version) {
      contentEntity.version = source.state.version;
    }
    if (source.state.updatedBy) {
      contentEntity.updatedBy = source.state.updatedBy;
    }
    if (source.state.updatedAt) {
      contentEntity.updatedAt = source.state.updatedAt;
    }

    return contentEntity;
  }

  static toPresenter(source: Content): ContentPresenter {
    const contentPresenter = new ContentPresenter();

    contentPresenter.id = source.id.value;
    contentPresenter.resourceId = source.state.resourceId;
    contentPresenter.createdBy = source.state.createdBy;

    if (source.state.status) {
      contentPresenter.status = source.state.status;
    }
    contentPresenter.version = source.state.version || null;
    contentPresenter.updatedBy = source.state.updatedBy || null;

    if (source.state.createdAt instanceof Date) {
      contentPresenter.createdAt = source.state.createdAt.toISOString();
    }
    if (source.state.updatedAt instanceof Date) {
      contentPresenter.updatedAt = source.state.updatedAt.toISOString();
    }

    return contentPresenter;
  }
}
