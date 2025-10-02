// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid', description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'João Silva', description: 'Full name of the user' })
  @Column({ type: 'varchar', length: 300 })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email of the user' })
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @ApiProperty({ example: 'hashedpassword', description: 'Hashed password' })
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @ApiProperty({ example: '2025-09-29T12:00:00Z', description: 'Creation date' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
