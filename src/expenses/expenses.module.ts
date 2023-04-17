import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MailModule,
    TypeOrmModule.forFeature([
        Expense, User]),  
    ],
  controllers: [ExpensesController],
  providers: [ExpensesService, UsersService]
})
export class ExpensesModule {}
