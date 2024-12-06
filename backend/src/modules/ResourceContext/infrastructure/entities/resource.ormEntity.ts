import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../../../../shared-kernel/modules/infrastructure/db/abstract.entity';
import { ResourceTypeEnum } from '../../../../modules/ResourceContext/shared/types/Resource';
import { Nullable } from '../../../../shared-kernel/utils/Nullable';

@Entity('resources')
@Index(['id'])
export class ResourceTypeOrmEntity extends AbstractEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: Nullable<string>;

  @Column()
  depth: number;

  @Column({ nullable: true, type: 'varchar' })
  parentId: Nullable<string>;

  @Column({ type: 'enum', enum: ResourceTypeEnum })
  type: ResourceTypeEnum;

  @Column({ type: 'varchar', length: 64, nullable: true })
  authToken: Nullable<string>;
}
