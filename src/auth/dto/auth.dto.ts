import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, isNotEmpty, IsString } from "class-validator"

export class AuthDto{
    @ApiProperty({ example: 'carloscunha@gmail.com' })
    @IsString()
    @IsNotEmpty()
    readonly email: string

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' })
    @IsString()
    @IsNotEmpty()
    readonly password: string
}

export class ReturnDataTokenDto{
    id:number
    email: string
}

export class TokenDto {    
    data: ReturnDataTokenDto
    iat: number
    exp: number
}