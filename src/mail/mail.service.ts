import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: CreateUserDto) {
    const mailOptions = {
        to: user.email,
        subject: 'Expense registered',
        text: 'Hey! Your expense has been successfully registered.',
        context: {
            name: user.name,
        },
    };

    const result = await this.mailerService.sendMail(mailOptions);

    if (!result)
      throw new BadRequestException('Registered expense email not sent.');
  }
}
