import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import Account from '../account/entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  idTransacao?: number;

  @ManyToOne(() => Account)
  idConta!: number;

  @Column('numeric')
  valor!: number;

  @CreateDateColumn({ name: 'dataTransacao', type: 'timestamp' })
  dataTransacao?: Date;
}

export default Transaction;
