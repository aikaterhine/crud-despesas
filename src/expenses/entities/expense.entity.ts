import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    } from 'typeorm';

import { User } from 'src/users/entities/user.entity';   

@Entity()
export class Expense extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: 'varchar', length: 191 })
    description: string;

    @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0})
    cost: number;

    @Column({ nullable: false, type: 'date'})
    date: Date;
    
    @ManyToOne(() => User)
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}