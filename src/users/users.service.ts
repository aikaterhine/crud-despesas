import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { toUserDto } from './utils/users.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }
  
  /*findAll() {
    return this.userRepository.find();
  }
  */

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email: email });
    return toUserDto(user);
  }

  /*update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }*/
}
