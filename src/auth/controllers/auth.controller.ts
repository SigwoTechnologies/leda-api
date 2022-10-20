import { AuthService } from '../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsRequestDto } from '../dto/credentials-request.dto';
import { CredentialsResponseDto } from '../dto/credentials-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signin')
  signin(@Body() authCredentialsDto: CredentialsRequestDto): Promise<CredentialsResponseDto> {
    return this.authService.signin(authCredentialsDto);
  }
}
