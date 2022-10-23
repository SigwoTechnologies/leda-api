import { AuthService } from '../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsRequestDto } from '../dto/credentials-request.dto';
import { CredentialsResponseDto } from '../dto/credentials-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { SigninRequestDto } from '../dto/signin-request.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() credentials: SigninRequestDto): Promise<CredentialsResponseDto> {
    return this.authService.signin(credentials);
  }

  @Post('/nonce')
  getNonce(@Body() authCredentialsDto: CredentialsRequestDto): Promise<string> {
    return this.authService.getNonce(authCredentialsDto);
  }
}
