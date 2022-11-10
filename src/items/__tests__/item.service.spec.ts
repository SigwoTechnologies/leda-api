import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '../../account/entities/account.entity';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { ItemRequestDto } from '../dto/item-request.dto';
import { ItemPaginationDto } from '../dto/pagination-request.dto';
import { PriceRangeDto } from '../dto/price-range.dto';
import { Image } from '../entities/image.entity';
import { Item } from '../entities/item.entity';
import { ItemStatus } from '../enums/item-status.enum';
import { TransactionType } from '../enums/transaction-type.enum';
import { HistoryRepository } from '../repositories/history.repository';
import { ItemRepository } from '../repositories/item.repository';
import { ItemService } from '../services/item.service';

const itemRepositoryMock = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByAccount: jest.fn(),
  findPriceRange: jest.fn(),
  pagination: jest.fn(),
  createItem: jest.fn(),
  listAnItem: jest.fn(),
  delistAnItem: jest.fn(),
});

const accountRepositoryMock = () => ({
  findByAddress: jest.fn(),
});

const historyRepositoryMock = () => ({
  findAll: jest.fn(),
  findAllByItemId: jest.fn(),
  createHistory: jest.fn(),
});

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository;
  let accountRepository;
  let historyRepository;
  let items: Item[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: ItemRepository, useFactory: itemRepositoryMock },
        { provide: AccountRepository, useFactory: accountRepositoryMock },
        { provide: HistoryRepository, useFactory: historyRepositoryMock },
      ],
    }).compile();

    service = await module.get(ItemService);
    itemRepository = await module.get(ItemRepository);
    accountRepository = await module.get(AccountRepository);
    historyRepository = await module.get(HistoryRepository);

    items = [
      {
        itemId: '1',
        name: 'test',
        description: 'test',
        price: '1',
        royalty: 1,
        status: ItemStatus.NotListed,
        tokenId: 1,
        collectionAddress: 'test',
        author: {} as Account,
        owner: {} as Account,
        image: {} as Image,
        listId: 1,
        likes: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        history: [],
      },
    ];
  });

  describe('When findAll function is called', () => {
    it('should return an array of items ', async () => {
      const expected = items;

      const mockedData = expected.map((prop) => ({ ...prop }));
      itemRepository.findAll.mockResolvedValue(mockedData);

      const actual = await service.findAll();

      expect(actual).toEqual(expected);
    });
  });

  describe('When findById function is called', () => {
    describe('and the itemId exist', () => {
      it('should return the expected item', async () => {
        const expected = items[0];

        itemRepository.findById.mockResolvedValue({ ...expected });

        const actual = await service.findById('123');

        expect(actual).toEqual(expected);
      });
    });

    describe('and the itemId does not exist', () => {
      it('should throw a NotFoundException with expected message', async () => {
        const unexistingId = '123';
        const errorMessage = `The item with id ${unexistingId} does not exist`;

        itemRepository.findById.mockResolvedValue(null);

        const exception = () => service.findById(unexistingId);

        await expect(exception).rejects.toThrow(NotFoundException);
        await expect(exception).rejects.toEqual(new NotFoundException(errorMessage));
      });
    });
  });

  describe('When findByAddress function is called', () => {
    describe('and the address exist', () => {
      it('should return the expected item', async () => {
        const account = { accountId: '456' } as Account;
        const expected = items;

        accountRepository.findByAddress.mockResolvedValue({ ...account });

        const mockedData = expected.map((prop) => ({ ...prop }));
        itemRepository.findByAccount.mockResolvedValue(mockedData);

        const actual = await service.findByAddress('123');

        expect(actual).toEqual(expected);
      });
    });

    describe('and the address does not exist', () => {
      it('should throw a BusinessException with expected message', async () => {
        const unexistingAddress = '123';

        accountRepository.findByAddress.mockResolvedValue(null);

        const exception = () => service.findByAddress(unexistingAddress);

        await expect(exception).rejects.toThrow(BusinessException);
        await expect(exception).rejects.toEqual(
          new BusinessException(BusinessErrors.address_not_associated)
        );

        expect(itemRepository.findByAccount).not.toHaveBeenCalled();
      });
    });
  });

  describe('When findPagination function is called', () => {
    it('should return a pagination object ', async () => {
      const expected = {
        page: 1,
        limit: 10,
        items: items,
        totalCount: 1,
      };

      const paginationDto = {
        likesOrder: 'desc',
        priceFrom: 0.001,
        priceTo: 1,
      } as ItemPaginationDto;

      const mockedData = { ...expected };
      itemRepository.pagination.mockResolvedValue(mockedData);

      const actual = await service.findPagination(paginationDto);

      expect(itemRepository.pagination).toHaveBeenCalledWith(paginationDto);
      expect(actual).toEqual(expected);
    });
  });

  describe('When findPriceRange function is called', () => {
    it('should return the cheapest and most expensive prices', async () => {
      const expected = {
        from: 0.001,
        to: 100,
      } as PriceRangeDto;

      const mockedData = { ...expected };
      itemRepository.findPriceRange.mockResolvedValue(mockedData);

      const actual = await service.findPriceRange();

      expect(itemRepository.findPriceRange).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });
  });

  describe('When create function is called', () => {
    describe('and the account exist', () => {
      it('should return the expected item', async () => {
        const account = { accountId: '456' } as Account;
        const expected = items[0];

        accountRepository.findByAddress.mockResolvedValue({ ...account });
        itemRepository.createItem.mockResolvedValue({ ...expected });

        const actual = await service.create({ address: '123' } as ItemRequestDto);

        expect(actual).toEqual(expected);
      });
    });

    describe('and the address does not exist', () => {
      it('should throw a BusinessException with expected message', async () => {
        const unexistingAddress = '123';

        accountRepository.findByAddress.mockResolvedValue(null);

        const exception = () => service.findByAddress(unexistingAddress);

        await expect(exception).rejects.toThrow(BusinessException);
        await expect(exception).rejects.toEqual(
          new BusinessException(BusinessErrors.file_extension_not_supported)
        );

        expect(itemRepository.createItem).not.toHaveBeenCalled();
      });
    });
  });

  describe('When listAnItem function is called', () => {
    describe('and the item exist', () => {
      it('should list the item and return it', async () => {
        const itemId = '123';
        const listId = 456;
        const price = '0.001';

        const expected = items[0];
        expected.price = price;
        expected.listId = listId;
        expected.status = ItemStatus.Listed;

        itemRepository.findById.mockResolvedValue({ ...items[0] });
        accountRepository.findByAddress.mockResolvedValue({ account: { accountId: '1' } });

        const actual = await service.listAnItem({
          itemId,
          listId,
          price,
          address: '',
        });

        expect(actual).toEqual(expected);
        expect(itemRepository.listAnItem).toHaveBeenCalled();
      });
    });

    describe('and the item does not exist', () => {
      it('should throw a NotFoundException with expected message', async () => {
        const unexistingId = '123';
        const errorMessage = `The item with id ${unexistingId} does not exist`;

        itemRepository.findById.mockResolvedValue(null);

        const exception = () =>
          service.listAnItem({ address: '', itemId: unexistingId, listId: 1, price: '1' });

        await expect(exception).rejects.toThrow(NotFoundException);
        await expect(exception).rejects.toEqual(new NotFoundException(errorMessage));

        expect(itemRepository.listAnItem).not.toHaveBeenCalled();
      });
    });
  });

  describe('When delistAnItem function is called ', () => {
    describe('and the execution is successful', () => {
      it('should return an item with status NotListed', async () => {
        const itemId = '123';
        const address = 'address';

        const item = { listId: 1 } as Item;
        const account = { accountId: '1' } as Account;

        itemRepository.findById.mockResolvedValue(item);

        accountRepository.findByAddress.mockResolvedValue(account);

        const expected = { ...item, status: ItemStatus.NotListed };

        const actual = await service.delistAnItem({ itemId, address });

        expect(itemRepository.delistAnItem).toHaveBeenCalledWith(itemId);
        expect(historyRepository.createHistory).toHaveBeenCalledWith({
          itemId,
          accountId: account.accountId,
          transactionType: TransactionType.Delisted,
          listId: item.listId,
        });
        expect(actual).toEqual(expected);
      });
    });
    describe('and the execution is unsuccessful', () => {
      it('throw a NotFoundException when item is not found', async () => {
        const unexistingItemId = '123';
        const unexistingAddress = 'address';
        const errorMessage = `The item with id ${unexistingItemId} does not exist`;

        itemRepository.findById.mockResolvedValue(null);

        const exception = () =>
          service.delistAnItem({ itemId: unexistingItemId, address: unexistingAddress });

        await expect(exception).rejects.toThrow(NotFoundException);
        await expect(exception).rejects.toEqual(new NotFoundException(errorMessage));

        expect(itemRepository.delistAnItem).not.toHaveBeenCalled();
      });
      it('throw a NotFoundException when account is not found', async () => {
        const itemId = '123';
        const unexistingAddress = 'address';
        const errorMessage = `The account with address ${unexistingAddress} does not exist`;

        itemRepository.findById.mockResolvedValue({} as Item);
        accountRepository.findByAddress.mockResolvedValue(null);

        const exception = () => service.delistAnItem({ itemId, address: unexistingAddress });

        await expect(exception).rejects.toThrow(NotFoundException);
        await expect(exception).rejects.toEqual(new NotFoundException(errorMessage));

        expect(itemRepository.delistAnItem).not.toHaveBeenCalled();
      });
    });
  });
});
