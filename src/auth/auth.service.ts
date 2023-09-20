import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';
import { EmailService } from 'src/email/email.service';
//import{EmailQueueService} from 'src/email/email-queue.service'
@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
   // private readonly emailQueueService: EmailQueueService,
    private readonly emailservice:EmailService
  ) {}

  async validateUser(username: string, email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async signup(dto: AuthDto) {
    const { username, email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    // await this.emailQueueService.sendWelcomeMail(dto.email);
    await this.emailservice.sendWelcomeMail(dto.email);

    return { message: 'Signup was successful' };
  }

  async signin(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new BadRequestException('Email does not exist');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.password,
    });

    if (!isMatch) {
      throw new BadRequestException('Wrong password');
    }

    const token = await this.signToken({ id: foundUser.id, email: foundUser.email });

    if (!token) {
      throw new ForbiddenException();
    }

    // Set secure and HttpOnly flags on the cookie for better security
    res.cookie('token', token, { secure: true, httpOnly: true });
    return res.send({ message: 'Logged in successfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Signed out successfully' });
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  private async signToken(args: { id: number; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
  async verifyToken(token: string) {
    try {
      // Verify and decode the JWT token
      const decoded = this.jwt.verify(token);
      return decoded;
    } catch (error) {
      throw error;
    }
  }
}
