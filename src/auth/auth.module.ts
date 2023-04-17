import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt'}),
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: {expiresIn: process.env.JWT_EXPIRE}
        }), 
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UsersService]
})
export class AuthModule {}