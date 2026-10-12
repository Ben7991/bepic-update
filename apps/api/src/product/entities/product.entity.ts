import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  @Transform(({ value }: { value: string }) => Number(value))
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt: Date;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
  })
  image: string;

  @Column({
    type: 'decimal',
    precision: 10,
    unsigned: true,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    type: 'smallint',
  })
  point: number;
}
