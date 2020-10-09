import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import Person from '../person/entity';

export enum accountType {
  CORRENTE = 1,
  POUPANCA = 2,
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  idConta?: number;

  @ManyToOne(() => Person)
  idPessoa!: number;

  @Column({
    type: 'numeric',
    default: 0,
  })
  saldo?: number;

  @Column({
    type: 'numeric',
    default: 1000,
  })
  limiteSaqueDiario?: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  flagAtivo?: boolean;

  @Column({
    type: 'int',
    enum: accountType,
    default: accountType.CORRENTE,
  })
  tipoConta?: number;

  @CreateDateColumn({ name: 'dataCriacao', type: 'timestamp' })
  dataCriacao?: Date;
}

export default Account;
