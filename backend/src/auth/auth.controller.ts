import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    if (user.role !== 'ADMIN')
      throw new Error('Acesso restrito ao perfil ADMIN');
    return { access_token: this.auth.signToken(user) };
  }

  @Post('user/login')
  async userLogin(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    return { access_token: this.auth.signToken(user) };
  }
}
