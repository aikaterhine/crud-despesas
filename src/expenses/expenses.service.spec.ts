import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from '../../src/mail/mail.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../../src/users/users.service';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4} from 'uuid';

const id = uuidv4();

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
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

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  create: jest.fn(entity => entity),
  find: jest.fn(entity => entity),
  findOne: jest.fn(entity => entity),
  findOneBy: jest.fn(entity => entity),
  update: jest.fn(entity => entity),
  delete: jest.fn(entity => entity),
}));


describe('ExpensesService', () => {
  let module: TestingModule;
  let expenseRepositoryMock: MockType<Repository<Expense>>;
  let mailRepositoryMock: MockType<MailService>;

  let expensesService: ExpensesService;

  let user: CreateUserDto;
  let expense: CreateExpenseDto;

  let expenseCreated: { owner: { email: string; name: string; id: string; }; description: string; cost: number; date: Date; };

  beforeEach(() => {
    user = {
      email: 'mock@email.com',
      name: 'Mock User'    
    };

    expense = {
        description: 'Netflix account',
        cost: 19.90,
        date: new Date('19-09-2020')
    };

    expenseCreated = { ...expense, owner: { id, ...user}};
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ExpensesService,
        UsersService,
        MailService,
        AuthService,      
        { provide: getRepositoryToken(Expense), useFactory: repositoryMockFactory },
        { provide: UsersService, useValue: userMockValue },
        { provide: MailService, useValue: mailMockValue },
        { provide: JwtService, useValue: jwtMockValue }
    ],
    }).compile();

    expensesService = module.get<ExpensesService>(ExpensesService);
    expenseRepositoryMock = module.get(getRepositoryToken(Expense));
    mailRepositoryMock = module.get(getRepositoryToken(Expense));
  });

  it('should be defined', () => {
    expect(expensesService).toBeDefined();
    expect(expenseRepositoryMock).toBeDefined();
  });

  describe('create', () => {
    it('should create a expense', async () => {
        expenseRepositoryMock.save.mockReturnValue(expenseCreated)
        
        const result = await expensesService.create(user, expense);

        expect(result).toBeDefined();
        expect(result).toEqual(expenseCreated);
        expect(expenseRepositoryMock.save).toHaveBeenCalledWith(expenseCreated);
    });

  })

  /*
  describe('findAllByOwner', () => {
    it('should find all expenses by owner', async () => {
      expenseRepositoryMock.findOneBy.mockReturnValue(user)
        
      const result = await expensesService.findOneByEmail(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(expenseRepositoryMock.findOneBy).toHaveBeenCalledWith({email: user.email});
    });
  })

  describe('findOneByOwner', () => {
    it('should find a expense by owner', async () => {
      expenseRepositoryMock.findOne.mockReturnValue(user)
        
      const result = await expensesService.findOne(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(expenseRepositoryMock.findOne).toHaveBeenCalledWith({where: {email: user.email}});
    });
  })

  describe('update', () => {
    it('should update a expense by id', async () => {
      expenseRepositoryMock.findOne.mockReturnValue(user)
        
      const result = await expensesService.findOne(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(expenseRepositoryMock.findOne).toHaveBeenCalledWith({where: {email: user.email}});
    });
  })
  
  describe('remove', () => {
    it('should remove a expense by id', async () => {
      expenseRepositoryMock.findOne.mockReturnValue(user)
        
      const result = await expensesService.findOne(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(expenseRepositoryMock.findOne).toHaveBeenCalledWith({where: {email: user.email}});
    });
  })
  
  
  
  */

});
