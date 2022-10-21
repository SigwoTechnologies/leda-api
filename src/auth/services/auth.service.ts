import { AccountRepository } from 'src/account/repositories/account.repository';
import { CredentialsRequestDto } from '../dto/credentials-request.dto';
import { CredentialsResponseDto } from '../dto/credentials-response.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from 'src/common/exceptions/exception-types';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private accountRepository: AccountRepository) {}

  async signin(credentials: CredentialsRequestDto): Promise<CredentialsResponseDto> {
    const { address } = credentials;
    const account = await this.accountRepository.findByAddress(address);

    if (account) {
      const access_token: string = this.jwtService.sign({
        address: account.address,
      });

      return { access_token };
    }

    throw new UnauthorizedException();
  }
}
