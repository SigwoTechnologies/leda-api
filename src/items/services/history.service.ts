import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { History } from '../entities/history.entity';
import { HistoryRepository } from '../repositories/history.repository';

@Injectable()
export class HistoryService {
  constructor(private historyRepository: HistoryRepository) {}

  async pagination(paginationDto: PaginationDto) {
    return this.historyRepository.pagination(paginationDto);
  }

  async findAllByItemId(itemId: string): Promise<History[]> {
    return this.historyRepository.findAllByItemId(itemId);
  }
}
