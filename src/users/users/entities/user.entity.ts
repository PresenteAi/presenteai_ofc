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

  @ApiProperty({ example: true, description: 'Indicates if the user is active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: true, description: 'Indicates if the user is a indicate user' })
  @Column({ type: 'boolean', default: false })
  isIndicated: boolean;

  @ApiProperty({example:1, description: 'User Id who indicated this user'})
  @Column({ type: 'int', nullable: true })
  indicatedById: number;

  @ApiProperty({ example: '2025-09-29T12:00:00Z', description: 'Last login date' })
  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @ApiProperty({ example: '2025-09-29T12:00:00Z', description: 'Last update date' })
  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ example: '2025-09-29T12:00:00Z', description: 'Creation date' })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
