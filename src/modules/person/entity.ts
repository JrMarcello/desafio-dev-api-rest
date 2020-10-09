import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  idPessoa?: number;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column({ type: 'date' })
  dataNascimento!: Date;
}

export default Person;
