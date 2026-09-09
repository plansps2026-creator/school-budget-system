import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
@Controller('auth')
export class AuthController {
  constructor(private auth:AuthService){}
  @Post('login') login(@Body() dto:LoginDto){return this.auth.login(dto.email,dto.password)}
  @UseGuards(AuthGuard('jwt')) @Get('me') me(@CurrentUser() user:unknown){return user}
}
