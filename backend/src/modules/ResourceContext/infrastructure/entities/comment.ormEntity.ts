import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../../shared-kernel/modules/infrastructure/db/abstract.entity';
import { ResourceTypeOrmEntity } from './resource.ormEntity';

@Entity('comments')
@Index(['id'])
export class CommentTypeOrmEntity extends AbstractEntity {
  @Column('uuid')
  resourceId: string;

  @ManyToOne(() => ResourceTypeOrmEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  resource: ResourceTypeOrmEntity;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'varchar', length: 64 })
  updatedBy: string;
}
