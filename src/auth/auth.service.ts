import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { PassportSerializer } from '@nestjs/passport';
import { SignDto } from './dto/signin.dto';

@Injectable()
export class AuthService extends PassportSerializer {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private readonly emailservice: EmailService,
     ) {
    super();
  }

  async validateUser(username: string, email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      this.logger.error(error, 'AuthService.validateUser');
      throw error;
    }
  }

  async signup(dto: AuthDto) {
    try {
      const { username, email, password } = dto;

      const foundUser = await this.prisma.user.findUnique({ where: { email } });

      if (foundUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await this.hashPassword(password);

      const createdUser = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      await this.emailservice.sendWelcomeMail(dto.email);

      this.logger.log('User signed up successfully', 'AuthService.signup');

      return {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          username: createdUser.username,
        },
      };
    } catch (error) {
      this.logger.error(error, 'AuthService.signup');
      throw error;
    }
  }

  async signin(dto: SignDto, req: Request, res: Response) {
    try {
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

      res.cookie('token', token, { secure: true, httpOnly: true });

      this.logger.log('User signed in successfully', 'AuthService.signin');

      return res.send({ message: 'Logged in successfully', token });
    } catch (error) {
      this.logger.error(error, 'AuthService.signin');
      throw error;
    }
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');

    this.logger.log('User signed out successfully', 'AuthService.signout');

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
      const decoded = this.jwt.verify(token);
      return decoded;
    } catch (error) {
      throw error;
    }
  }
  async findOrCreate(profile: any): Promise<any> {
    try {
      const existingUser = await this.findUserByEmail(profile.emails[0].value);

      if (existingUser) {
        this.logger.debug(`User found with email: ${profile.emails[0].value}`);
        return existingUser;
      }

      const newUser = await this.createUserFromGoogleProfile(profile);

      this.logger.log(`New user created with email: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(error, 'AuthService.findOrCreate');
      throw error;
    }
  }

  private async findUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (user) {
        this.logger.debug(`User found by email: ${email}`);
      }

      return user;
    } catch (error) {
      this.logger.error(error, 'AuthService.findUserByEmail');
      throw error;
    }
  }

  private async createUserFromGoogleProfile(profile: any): Promise<any> {
    try {
      const email = profile.emails[0].value;
      const displayName = profile.displayName;
      const profilePicture = profile.photos[0].value;

      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          username: displayName,
          profilePicture: profilePicture,
          about: `Hey there, I'm using WhatsApp Clone!`,
        },
      });

      this.logger.log(`New user created with email: ${email}`);

      return newUser;
    } catch (error) {
      this.logger.error(error, 'AuthService.createUserFromGoogleProfile');
      throw error;
    }
  }
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
    done(null, payload);
  }

}
