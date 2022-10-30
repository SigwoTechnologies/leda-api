import { AccountsController } from '../controllers/account.controller';
import { Test } from '@nestjs/testing';
import { Item } from '../../items/entities/item.entity';
import { ItemStatus } from '../../items/enums/item-status.enum';
import { Account } from '../entities/account.entity';
import { Image } from '../../config/entities.config';
import { ItemService } from '../../items/services/item.service';

const itemServiceMock = () => ({
  findByAddress: jest.fn(),
});

describe('AccountController', () => {
  let controller: AccountsController;
  let itemService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: ItemService, useFactory: itemServiceMock }],
    }).compile();

    controller = await module.get(AccountsController);
    itemService = await module.get(ItemService);
  });

  describe('When calling findItems function', () => {
    describe('and the address is valid', () => {
      it('should return an array of items', async () => {
        const expected: Item[] = [
          {
            itemId: '1',
            name: 'test',
            description: 'test',
            price: '1',
            royalty: 1,
            status: ItemStatus.Listed,
            tokenId: 1,
            listId: 1,
            collectionAddress: 'test',
            author: {} as Account,
            owner: {} as Account,
            image: {} as Image,
            likes: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        const mockData = expected.map((prop) => ({ ...prop }));
        itemService.findByAddress.mockResolvedValue(mockData);

        const actual = await controller.findItems('123');

        expect(actual[0].itemId).toEqual(expected[0].itemId);
      });
    });
  });
});
