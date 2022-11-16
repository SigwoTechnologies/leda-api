import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PinataRepository } from '../repositories/pinata.repository';
import { appConfig } from '../../config/app.config';
import { BusinessException } from '../../common/exceptions/exception-types';
import { isValidExtension, isValidSize } from '../../common/utils/image-utils';
import { BusinessErrors } from '../../common/constants';
import { PinataResponse } from '../../common/types/pinata-response';
import { IpfsAttribute } from 'src/common/types/ipfs-attribute';

@Injectable()
export class PinataService {
  constructor(private pinataRepository: PinataRepository) {}
  async upload(
    image: Express.Multer.File,
    attributes: IpfsAttribute,
    itemId: string
  ): Promise<PinataResponse> {
    const { buffer, originalname, mimetype, size } = image;
    if (!isValidExtension(image))
      throw new BusinessException(BusinessErrors.file_extension_not_supported);

    if (!isValidSize(size)) throw new BusinessException(BusinessErrors.file_size_exceeded);

    const formData = new FormData();
    const filename = originalname.replace(/\.[^/.]+$/, '');

    formData.append('file', buffer, {
      contentType: mimetype,
      filename: filename + '-' + uuidv4(),
    });

    const response = await this.pinataRepository.uploadImage(formData);
    return this.uploadMetadata(response.IpfsHash, attributes, itemId);
  }

  async uploadMetadata(
    imageHash: string,
    attributes: IpfsAttribute,
    itemId: string
  ): Promise<PinataResponse> {
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataContent: {
        description: 'Example', // TODO: Define this description once front end is implemented
        external_url: itemId, // TODO: Define this url once front end is implemented
        name: 'Example', // TODO: Define this description once front end is implemented
        attributes,
        image: `${appConfig().pinataGatewayUrl}/${imageHash}`,
      },
    });

    return this.pinataRepository.uploadMetadata(data);
  }
}
