import { BaseEntity, Column, DeleteDateColumn, CreateDateColumn, Entity, IsNull, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;
  
  @Column({ type: 'varchar'})
  public description: string;

  @CreateDateColumn()
  public createdAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}