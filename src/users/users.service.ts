import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { toUserDto } from './utils/users.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const result = await this.userRepository.save(createUserDto);

    if (!result) throw new BadRequestException('Error creating your user.')

    return toUserDto(result);
  }

  async findOne(email: string) {
    const result = await this.userRepository.findOne({ where: { email } });

    if (!result) throw new NotFoundException('No user registered at this email address.')

    return result;
  }

  async findOneByEmail(email: string) {
    const result = await this.userRepository.findOneBy({ email: email });

    if (!result) throw new NotFoundException('No user registered at this email address.')

    return toUserDto(result);
  }
}
