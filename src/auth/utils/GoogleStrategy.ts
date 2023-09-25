import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      clientID: '785814267987-a67hnrk3p3g26envgv8a86p8m1nlsugo.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.authService.findOrCreate(profile);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
    
  }
 }