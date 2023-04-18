import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UsersService } from '../../src/users/users.service';
import { User } from './entities/user.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn(entity => entity),
  findOneBy: jest.fn(entity => entity),
  findOne: jest.fn(entity => entity)
}));

describe('UsersService', () => {
  let module: TestingModule;
  let userRepositoryMock: MockType<Repository<User>>;
  let usersService: UsersService;

  let user: CreateUserDto;

  beforeEach(() => {
    user = {
      email: 'mock@email.com',
      name: 'Mock User'    
    };
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService, 
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory }
    ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
        userRepositoryMock.save.mockReturnValue(user)
        
        const result = await usersService.create(user);

        expect(result).toBeDefined();
        expect(result).toEqual(user);
        expect(userRepositoryMock.save).toHaveBeenCalledWith(user);
    });

  })

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      userRepositoryMock.findOneBy.mockReturnValue(user)
        
      const result = await usersService.findOneByEmail(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({email: user.email});
    });
  })

  describe('findOne', () => {
    it('should find a user by email', async () => {
      userRepositoryMock.findOne.mockReturnValue(user)
        
      const result = await usersService.findOne(user.email);

      expect(result).toBeDefined();
      expect(result).toEqual(user);
      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({where: {email: user.email}});
    });
  })

});
