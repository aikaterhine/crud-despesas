import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Length, MaxDate, MinDate } from 'class-validator';

export class CreateExpenseDto {
    @ApiProperty({ example: 'carloscunha@gmail.com' })
    @IsString()
    @IsNotEmpty()
    @Length(3, 191)
    description: string;

    @ApiProperty({ example: 'Carlos Cunha' })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    cost: number;

    @ApiProperty({ example: '2018-05-23' })
    @IsNotEmpty()
    @IsDate({message: 'date format allowed for expense is yyyy-mm-dd'})
    @MaxDate(new Date(), { message: 'maximum date allowed for expense is today.'})
    @MinDate(new Date(1800, 1), { message: 'minimal date allowed for expense is january 1st, 1800.'})
    @Type(() => Date)
    date: Date;
}