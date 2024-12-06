import {
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 64 })
  createdBy: string;

  @CreateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  public updatedAt: Date;
}
