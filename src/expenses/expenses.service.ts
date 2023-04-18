import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../src/mail/mail.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UsersService } from '../../src/users/users.service';
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
    const expense = this.expenseRepository.create({ description, cost, date, owner });

    if(!expense) throw new BadRequestException('Error creating your expense.')
    
    await this.mailService.sendEmail(owner);

    return this.expenseRepository.save(expense);
  }

  async findAllByOwner({ email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);
    const expense = await this.expenseRepository.find({where: {owner}});
    
    if(!expense) throw new NotFoundException('No expenses that you own were found.')

    return expense;
  }

  async findOneByOwner(id: number, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);
    const expense = await this.expenseRepository.findOne({where: {owner, id}});

    if(!expense) throw new NotFoundException('No expenses that you own were found using this id.')

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);
    const result = await this.expenseRepository.update({owner, id}, updateExpenseDto)

    if (result && result.affected > 0) {
      const expenseUpdated = await this.expenseRepository.findOne({where: {owner, id}});
      return expenseUpdated;
    } else throw new NotFoundException('No expenses that you own were found using this id.')
  }

  async remove(id: number, { email }: CreateUserDto) {
    const owner = await this.usersService.findOneByEmail(email);
    const result = await this.expenseRepository.delete({ owner, id });

    if (!result || result.affected === 0)
      throw new NotFoundException('No expenses that you own were found using this id.')
  }
}
