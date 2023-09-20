import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'prisma/prisma.module';
import { EmailService } from 'src/email/email.service';
import { EmailController } from 'src/email/email.controller';
import { EmailModule } from 'src/email/email.module';
// import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [JwtModule.register({
    global:true,
  }), PassportModule, PrismaModule,EmailModule,
   ],
  controllers: [AuthController,EmailController],
  providers: [AuthService,EmailService],
})
export class AuthModule {}