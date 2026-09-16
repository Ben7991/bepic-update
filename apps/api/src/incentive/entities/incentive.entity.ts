import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

import { ItemAvailabilityStatus } from '../../utils/types.utils';

@Entity({ name: 'incentives' })
export class Incentive {
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  @Transform(({ value }: { value: string }) => Number(value))
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column()
  point: number;

  @Column()
  award: string;

  @Column({
    type: 'enum',
    enum: ItemAvailabilityStatus,
    default: ItemAvailabilityStatus.ACTIVE,
  })
  @Exclude()
  status: ItemAvailabilityStatus;
}
