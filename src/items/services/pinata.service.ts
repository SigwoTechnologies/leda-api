import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PinataRepository } from '../repositories/pinata.repository';
import { appConfig } from 'src/config/app.config';
import { IpfsAttribute } from 'src/common/types/ipfs-attribute';
import PinataResponse from 'src/common/types/pinata-response';

@Injectable()
export class PinataService {
  constructor(private pinataRepository: PinataRepository) {}
  async upload(image: Express.Multer.File, attributes: IpfsAttribute): Promise<PinataResponse> {
    const { buffer, originalname, mimetype } = image;
    const formData = new FormData();
    const filename = originalname.replace(/\.[^/.]+$/, '');

    formData.append('file', buffer, {
      contentType: mimetype,
      filename: filename + '-' + uuidv4(),
    });

    const response = await this.pinataRepository.uploadImage(formData);
    return this.uploadMetadata(response.IpfsHash, attributes);
  }

  async uploadMetadata(imageHash: string, attributes: IpfsAttribute): Promise<PinataResponse> {
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataContent: {
        description: 'Example', // TODO: Define this description once front end is implemented
        external_url: 'Example', // TODO: Define this description once front end is implemented
        name: 'Example', // TODO: Define this description once front end is implemented
        attributes,
        image: `${appConfig().pinataGatewayUrl}/${imageHash}`,
      },
    });

    return this.pinataRepository.uploadMetadata(data);
  }
}
