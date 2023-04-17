import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty() 
    id: string;

    @ApiProperty({ example: 'carloscunha@gmail.com' })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Carlos Cunha' })
    @IsString()
    @IsNotEmpty()
    name: string;
}