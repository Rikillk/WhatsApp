import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  

  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Post('signup')
  async signup(@Body() authDto: AuthDto) {
    const user = await this.authService.signup(authDto);
    return { message: 'Registration successful', user };
  }

  @UseGuards(AuthGuard)
  @Post('signin')
  signin(@Body() dto:AuthDto, @Req() req, @Res() res){
    return this.authService.signin(dto, req, res)
  }
  @UseGuards(AuthGuard)
  @Get('signout')
  signout(@Req() req, @Res() res){
    return this.authService.signout(req, res)
  }
}
