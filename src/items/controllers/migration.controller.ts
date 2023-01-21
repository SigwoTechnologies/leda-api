import { Controller, Post, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { MigrationRequestDto } from '../dto/migration-request.dto';
import { MigrationService } from '../services/migration.service';

type JupApeType = {
  name: string;
  description: string;
  itemProperties: JupApeProps[];
  price: string;
  royalty: number;
};

type JupApeProps = {
  key: string;
  value: string;
};

@Controller('migration')
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @Public()
  @Post()
  start(@Query() migrationQuery: MigrationRequestDto) {
    console.log('Executing controller: v4');
    return this.migrationService.init({
      from: Number(migrationQuery.from),
      to: Number(migrationQuery.to),
    });
  }
}
