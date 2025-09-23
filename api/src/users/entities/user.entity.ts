import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' }) // Isso diz ao TypeORM que esta classe é um modelo para a tabela 'users'
export class User {
  @PrimaryGeneratedColumn('uuid') // Define a chave primária como um UUID (um ID longo e único)
  id: string;

  @Column() // Define uma coluna para o nome do usuário
  name: string;

  @Column({ unique: true }) // Define a coluna de email e garante que cada email seja único no banco
  email: string;

  @Column() // Define a coluna para a senha (armazenaremos a senha criptografada aqui)
  password: string;

  @CreateDateColumn({ name: 'created_at' }) // Cria uma coluna que registra a data de criação automaticamente
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Cria uma coluna que atualiza a data a cada modificação
  updatedAt: Date;
}