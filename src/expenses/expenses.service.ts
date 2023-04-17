import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}
  
  async create({ email }: CreateUserDto, createExpenseDto: CreateExpenseDto) {
    const { description, cost, date } = createExpenseDto;

    const owner = await this.usersService.findOneByEmail(email);

    if (!owner)
      return;
    
    const expense: Expense = this.expenseRepository.create({ description, cost, date, owner });

    if(!expense)
      return;
    
    await this.mailService.sendEmail(owner);
    return this.expenseRepository.save(expense);
  }

  async findAllByOwner({ email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);

    if(!owner)
      return;
    
    return this.expenseRepository.find({where: {owner}});
  }

  async findOneByOwner(id: number, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);

    if(!owner)
      return;

    return this.expenseRepository.findOne({where: {owner, id}});
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);

    if (!owner)
      return;

    const expense = await this.expenseRepository.findOne({where: {owner, id}});

    if(!expense)
      return;

    return this.expenseRepository.update(id, updateExpenseDto);
  }

  async remove(id: number, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);

    if(!owner)
      return;

    return this.expenseRepository.delete({ owner, id });
  }
}
