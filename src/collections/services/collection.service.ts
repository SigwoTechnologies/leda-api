import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Collection } from '../entities/collection.entity';
import { CollectionRepository } from '../repositories/collection.repository';

@Injectable()
export class CollectionService {
  constructor(private collectionRepository: CollectionRepository) {}

  async findPagination(paginationValues: PaginationDto) {
    return this.collectionRepository.pagination(paginationValues);
  }

  async findByOwner(address: string): Promise<Collection[]> {
    return this.collectionRepository.findByOwner(address);
  }
}
