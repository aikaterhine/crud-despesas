import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { v4 as uuidv4} from 'uuid';
import { MailService } from '../../src/mail/mail.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';

const id = uuidv4();

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockValue = {
  create: jest.fn().mockImplementation((user: CreateUserDto, expense: CreateExpenseDto) => Promise.resolve({ ...expense, owner: { id, ...user}})),
  findAllByOwner: jest.fn().mockImplementation((user: CreateUserDto) => Promise.resolve({ description: 'Netflix account', cost: 19.90, date: new Date('01-21-2023')} )),
};

export const mailMockValue = {
    sendEmail: jest.fn().mockImplementation((user: CreateUserDto) => Promise.resolve({})),
};
  
export const jwtMockValue = {
    sign: jest.fn().mockImplementation((user: CreateUserDto) => Promise.resolve({})),
};

export const userMockValue = {
    findOneByEmail: jest.fn().mockImplementation((email: string) => Promise.resolve({id, name: 'Mock User', email})),
};

describe('ExpensesController', () => {
  let module: TestingModule;
  let expensesService: ExpensesService;
  let expensesController: ExpensesController;

  let user: CreateUserDto;
  let expense: CreateExpenseDto;
  let requestMock: Request;

  let expenseCreated: { expense: { owner: { email: string; name: string; id: string; }; description: string; cost: number; date: Date; }; };
  let arrayExpenses;

  beforeEach(() => {
    user = {
      email: 'mock@email.com',
      name: 'Mock User'
    };

    expense = {
      description: 'Netflix account',
      cost: 19.90,
      date: new Date('01-21-2023')
    };

    expenseCreated = {expense: { ...expense, owner: { id, ...user}}};

    arrayExpenses = {expenses: {description: 'Netflix account',
    cost: 19.90,
    date: new Date('01-21-2023')}};

    requestMock = {
        query: {},
        user        
    } as unknown as Request;
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        ExpensesService,
        MailService,
        UsersService,
        { provide: ExpensesService, useValue: repositoryMockValue },
        { provide: UsersService, useValue: userMockValue },
        { provide: MailService, useValue: mailMockValue },
        { provide: JwtService, useValue: jwtMockValue }
    ],
    }).compile();

    expensesController = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(expensesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
        const result = await expensesController.create(expense, requestMock)
        
        expect(result).toBeDefined();
        expect(result).toEqual({message: 'Expense created successfully. Confirmation sent by email.', ...expenseCreated});
        expect(expensesService.create).toHaveBeenCalledWith(user, expense);
    });

  })

  describe('findAll', () => {
    it('should find all expenses by user', async () => {        
        const result = await expensesController.findAll(requestMock)

        expect(result).toBeDefined();
        expect(result).toEqual({message: 'Expenses found successfully.', ...arrayExpenses});
        expect(expensesService.findAllByOwner).toHaveBeenCalledWith(user);
    });
  })
});