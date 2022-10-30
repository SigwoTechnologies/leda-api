import { Account } from '../../account/entities/account.entity';
import { AccountRepository } from '../../account/repositories/account.repository';
import { BusinessErrors } from '../../common/constants';
import { BusinessException, NotFoundException } from '../../common/exceptions/exception-types';
import { Image } from '../entities/image.entity';
import { Item } from '../entities/item.entity';
import { ItemRepository } from '../repositories/item.repository';
import { ItemService } from '../services/item.service';
import { ItemStatus } from '../enums/item-status.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemRequestDto } from '../dto/item-request.dto';

const itemRepositoryMock = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByAccount: jest.fn(),
  createItem: jest.fn(),
});

const accountRepositoryMock = () => ({
  findByAddress: jest.fn(),
});

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository;
  let accountRepository;
  let items: Item[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: ItemRepository, useFactory: itemRepositoryMock },
        { provide: AccountRepository, useFactory: accountRepositoryMock },
      ],
    }).compile();

    service = await module.get(ItemService);
    itemRepository = await module.get(ItemRepository);
    accountRepository = await module.get(AccountRepository);

    items = [
      {
        itemId: '1',
        name: 'test',
        description: 'test',
        price: '1',
        royalty: 1,
        status: ItemStatus.Listed,
        tokenId: 1,
        collectionAddress: 'test',
        author: {} as Account,
        owner: {} as Account,
        image: {} as Image,
        listId: 1,
        likes: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  });

  describe('When findAll function is called', () => {
    it('should return an array of items', async () => {
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
});
