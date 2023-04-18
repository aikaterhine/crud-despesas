import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'carloscunha@gmail.com' })
    @IsString()
    @IsNotEmpty({ message: 'The email is required' })
    @IsEmail({}, { message: 'Incorrect email' })
    email: string;

    @ApiProperty({ example: 'Carlos Cunha' })
    @IsString()
    @IsNotEmpty({ message: 'The name is required' })
    name: string;
}