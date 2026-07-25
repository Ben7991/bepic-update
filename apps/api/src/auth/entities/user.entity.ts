import { Column, Entity, PrimaryColumn } from 'typeorm';

import { Role, Status } from '../auth.types';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({
    type: 'varchar',
    length: 15,
  })
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
}
