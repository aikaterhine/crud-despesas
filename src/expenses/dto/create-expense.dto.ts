import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Length, MaxDate, MinDate } from 'class-validator';

export class CreateExpenseDto {
    @ApiProperty({ example: 'carloscunha@gmail.com' })
    @IsString()
    @IsNotEmpty({ message: 'The description is required' })
    @Length(3, 191)
    description: string;

    @ApiProperty({ example: 'Carlos Cunha' })
    @IsNumber()
    @IsNotEmpty({ message: 'The cost is required' })
    @IsPositive()
    cost: number;

    @ApiProperty({ example: '2018-05-23' })
    @IsNotEmpty({ message: 'The date is required' })
    @IsDate({message: 'date format allowed for expense is yyyy-mm-dd'})
    @MaxDate(new Date(), { message: 'maximum date allowed for expense is today.'})
    @MinDate(new Date(1800, 1), { message: 'minimal date allowed for expense is january 1st, 1800.'})
    @Type(() => Date)
    date: Date;
}