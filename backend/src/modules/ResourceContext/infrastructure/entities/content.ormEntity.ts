import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../../shared-kernel/modules/infrastructure/db/abstract.entity';
import { Nullable } from '../../../../shared-kernel/utils/Nullable';
import { ResourceTypeOrmEntity } from './resource.ormEntity';
import { ContentStatusEnum } from '../../../../modules/ResourceContext/shared/types/Content';

@Entity('contents')
@Index(['id'])
export class ContentTypeOrmEntity extends AbstractEntity {
  @Column('uuid')
  resourceId: string;

  @ManyToOne(() => ResourceTypeOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resource: ResourceTypeOrmEntity;

  @Column({ type: 'enum', enum: ContentStatusEnum })
  status: ContentStatusEnum;

  @Column({ nullable: true, type: 'int' })
  version: Nullable<number>;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, type: 'bytea' })
  pngContent: Nullable<Uint8Array>;

  @Column({ type: 'varchar', length: 64 })
  updatedBy: string;
}
