import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockValue = {
  create: jest.fn().mockImplementation((user: CreateUserDto) => Promise.resolve({id: 'e95fe8ab-bc50-4358-a746-f07c4409c9c2', ...user})),
  findOneByEmail: jest.fn().mockImplementation((email: string) => Promise.resolve({id: 'e95fe8ab-bc50-4358-a746-f07c4409c9c2', name: 'Mock User', email})),
};

describe('UsersController', () => {
  let module: TestingModule;
  let usersService: UsersService;
  let usersController: UsersController;
  let user: CreateUserDto;

  beforeEach(() => {
    user = {
      email: 'mock@email.com',
      name: 'Mock User'
    };
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService, 
        { provide: UsersService, useValue: repositoryMockValue }
    ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
        const result = await usersController.create(user)
        
        expect(result).toBeDefined();
        expect(result).toEqual({message: 'User created successfully.', user: { id: 'e95fe8ab-bc50-4358-a746-f07c4409c9c2', ...user}});
        expect(usersService.create).toHaveBeenCalledWith(user);
    });

  })

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {        
      const result = await usersController.findOneByEmail(user.email);
        
      expect(result).toBeDefined();
      expect(result).toEqual({message: 'User found successfully.', user: { id: 'e95fe8ab-bc50-4358-a746-f07c4409c9c2', ...user}});
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
    });
  })
});
