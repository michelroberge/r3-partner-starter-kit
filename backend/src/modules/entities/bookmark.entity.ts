import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '@r3/backend';

@Entity('bookmarks')
@Index(['tenantId'])
@Index(['createdById'])
// NOSONAR(typescript:S101): this class name is entirely a scaffold token;
// scaffold-module.cjs substitutes it with a real PascalCase entity name
// (e.g. `Widget`) when this blueprint is copied into a generated module.
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'uuid' })
  createdById!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
