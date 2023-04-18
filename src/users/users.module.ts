import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {expiresIn: process.env.JWT_EXPIRE}
    }), 
  ],
  controllers: [UsersController],
  providers: [AuthService, JwtStrategy, UsersService]
})
export class UsersModule {}
