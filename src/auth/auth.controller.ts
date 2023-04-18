import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  async login(@Body() user: AuthDto) {
    const access_token = await this.authService.validateUser(user.email, user.password);
    
    return {
      access_token,
      message: 'Successful login.',
    };
  }
}