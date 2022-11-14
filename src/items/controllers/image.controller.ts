import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PinataService } from '../services/pinata.service';
import { IpfsObject } from 'src/common/types/ipfs-object';

@Controller('images')
export class ImagesController {
  constructor(private pinataService: PinataService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async upload(@UploadedFile() image: Express.Multer.File, @Body() ipfsObject: IpfsObject) {
    return this.pinataService.upload(image, ipfsObject);
  }
}
