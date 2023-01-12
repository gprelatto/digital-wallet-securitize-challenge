import { BaseEntity, Column, DeleteDateColumn,JoinColumn , CreateDateColumn, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from './currency.entity';

@Entity()
export class ExchangeRate extends BaseEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Currency)
  @JoinColumn()
  public currency:Currency;

  @Column({ type: 'numeric'})
  public rate: number;

  @CreateDateColumn()
  public createdAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}