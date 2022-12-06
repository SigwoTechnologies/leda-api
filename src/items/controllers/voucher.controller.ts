import { Controller, Delete, Param } from '@nestjs/common';
import { VoucherService } from '../services/voucher.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private voucherService: VoucherService) {}

  @Delete('/:voucherId')
  paginate(@Param('voucherId') voucherId: string) {
    return this.voucherService.deleteVoucher(voucherId);
  }
}
