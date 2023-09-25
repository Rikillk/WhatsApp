import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guard';
import { GoogleAuthGuard } from './utils/Guards';
import { ApiBadRequestResponse, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SignDto } from './dto/signin.dto';


@Controller('auth')
export class AuthController {
  

  constructor(private readonly authService: AuthService) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    
    return { msg: 'Google Authentication' };
  }


  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req, @Res() res) {
    const user = req.user;

    if (user) {

      return res.redirect('/api');
    } else {
      return res.redirect('/login'); 
    }
  }
  // @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'User Signed Up successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: Invalid data',
  })
  @Post('signup')
  async signup(@Body() authDto: AuthDto) {
    const user = await this.authService.signup(authDto);
    return { message: 'Registration successful', user };
  }

  //@UseGuards(AuthGuard)
  @Post('signin')
  signin(@Body() dto:SignDto, @Req() req, @Res() res){
    return this.authService.signin(dto, req, res)
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('signout')
  signout(@Req() req, @Res() res){
    return this.authService.signout(req, res)
  }
}
