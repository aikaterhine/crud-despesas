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
  async create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const expense = await this.expensesService.create(user, createExpenseDto);

    return {
      expense,
      message: 'Expense created successfully. Confirmation sent by email.',
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req: any) {
    const user = <CreateUserDto>req.user;
    const expenses = await this.expensesService.findAllByOwner(user);
    
    return {
      expenses,
      message: 'Expenses found successfully.',
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const expense = await this.expensesService.findOneByOwner(+id, user);

    return {
      expense,
      message: 'Expense found successfully.',
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    const expense = await this.expensesService.update(+id, updateExpenseDto, user);

    return {
      expense,
      message: 'Expense updated successfully.',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = <CreateUserDto>req.user;

    await this.expensesService.remove(+id, user);

    return {
      message: 'Expense deleted successfully.',
    };
  }
}
