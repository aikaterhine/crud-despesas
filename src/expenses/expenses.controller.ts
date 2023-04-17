import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: any) {
    const user = <CreateUserDto>req.user;
    const expense = this.expensesService.create(user, createExpenseDto);

    if(!expense)
      throw new BadRequestException('Error creating your expense.')

    return expense;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: any) {
    const user = <CreateUserDto>req.user;

    const expenses = await this.expensesService.findAllByOwner(user);
    if (!expenses)
      throw new NotFoundException('No expenses that you own were found.')

    return expenses;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const expenses = await this.expensesService.findOneByOwner(+id, user);
    if (!expenses)
      throw new NotFoundException('No expenses that you own were found using this id.')

    return expenses;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const updatedExpense = await this.expensesService.update(+id, updateExpenseDto, user);

    if (!updatedExpense || updatedExpense.affected === 0)
      throw new NotFoundException('No expenses that you own were found using this id.')

    return updateExpenseDto;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const removedExpense = await this.expensesService.remove(+id, user);

    if (!removedExpense || removedExpense.affected === 0)
      throw new NotFoundException('No expenses that you own were found using this id.')

    return 'Expense removed successfully.';
  }
}
