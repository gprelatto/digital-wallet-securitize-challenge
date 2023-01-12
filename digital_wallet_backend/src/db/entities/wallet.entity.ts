import { BaseEntity, Column, DeleteDateColumn, CreateDateColumn, Entity, IsNull, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;
  
  @Column({ type: 'varchar'})
  public address: string;

  @Column({ type: 'boolean'})
  public isFavorite: boolean;

  @Column({ type: 'boolean'})
  public isOld: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}