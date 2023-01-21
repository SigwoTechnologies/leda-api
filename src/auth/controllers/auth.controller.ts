import { AuthService } from '../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsRequestDto } from '../dto/credentials-request.dto';
import { CredentialsResponseDto } from '../dto/credentials-response.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { SigninRequestDto } from '../dto/signin-request.dto';
import { IsAddressValid } from '../decorators/address.decorator';
import { AccountService } from '../../account/services/account.service';
import { Account } from '../../account/entities/account.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private accountService: AccountService) {}

  @Public()
  @Post('/signin')
  signin(@Body() credentials: SigninRequestDto): Promise<CredentialsResponseDto> {
    return this.authService.signin(credentials);
  }

  @Public()
  @Post('/nonce')
  getNonce(@Body() authCredentialsDto: CredentialsRequestDto): Promise<string> {
    return this.authService.getNonce(authCredentialsDto);
  }

  @IsAddressValid()
  @Post('/authenticate')
  authenticate(@Body() authCredentialsDto: CredentialsRequestDto): Promise<Account> {
    return this.accountService.findAccountByAddress(authCredentialsDto.address);
  }
}
