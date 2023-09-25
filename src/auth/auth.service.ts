import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';
import { Request, Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { PassportSerializer } from '@nestjs/passport';
import { SignDto } from './dto/signin.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@Injectable()
export class AuthService extends PassportSerializer {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private readonly emailservice: EmailService
  ) {
    super();
  }

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

    const createdUser=await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    await this.emailservice.sendWelcomeMail(dto.email);

    return{  
    user:{id: createdUser.id,email:createdUser.email,username:createdUser.username }
  };
}
  

  async signin(dto: SignDto, req: Request, res: Response) {
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
    return res.send({ message: 'Logged in successfully',token });
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
      const decoded = this.jwt.verify(token);
      return decoded;
    } catch (error) {
      throw error;
    }
  }
  async findOrCreate(profile: any): Promise<any> {
    const existingUser = await this.findUserByEmail(profile.emails[0].value);

    if (existingUser) {
      return existingUser;
    }

    const newUser = await this.createUserFromGoogleProfile(profile);

    return newUser;
  }



  private async findUserByEmail(email: string): Promise<any> {
    return this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }


  private async createUserFromGoogleProfile(profile: any): Promise<any> {
    const googleId = profile.id;
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

    return newUser;
  }
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void) {
    done(null, payload);
  }

}
