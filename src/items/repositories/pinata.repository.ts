import * as FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { appConfig } from 'src/config/app.config';
import { PinataResponse } from 'src/common/types/pinata-response';

@Injectable()
export class PinataRepository {
  constructor(private readonly httpService: HttpService) {}

  async uploadImage(formData: FormData): Promise<PinataResponse> {
    const { pinataApiKey, pinataApiSecret, pinataUrl } = appConfig();
    const observable = this.httpService
      .post(`${pinataUrl}/pinning/pinFileToIPFS`, formData, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataApiSecret,
        },
      })
      .pipe(map((res) => res.data));

    return lastValueFrom<PinataResponse>(observable);
  }

  async uploadMetadata(data: string): Promise<PinataResponse> {
    const { pinataApiKey, pinataApiSecret, pinataUrl } = appConfig();
    const observable = this.httpService
      .post(`${pinataUrl}/pinning/pinJSONToIPFS`, data, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataApiSecret,
        },
      })
      .pipe(map((res) => res.data));

    return lastValueFrom<PinataResponse>(observable);
  }
}
