import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    
    if (user.password === password) {
      return await this.generateToken(user);
    }
    throw new UnauthorizedException('Invalid credentials.');
  }

  async generateToken(payload: User) {
    return {
      access_token: this.jwtService.sign({email: payload.email}),
    };
  }
}
