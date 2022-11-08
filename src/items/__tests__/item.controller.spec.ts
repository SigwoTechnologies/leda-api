import { Account } from '../../account/entities/account.entity';
import { Image } from '../entities/image.entity';
import { ImageRequestDto } from '../dto/image-request.dto';
import { Item } from '../../items/entities/item.entity';
import { ItemsController } from '../controllers/item.controller';
import { ItemService } from '../../items/services/item.service';
import { ItemStatus } from '../../items/enums/item-status.enum';
import { Test } from '@nestjs/testing';
import { HistoryService } from '../services/history.service';

const itemServiceMock = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findPagination: jest.fn(),
  create: jest.fn(),
});

const historyServiceMock = () => ({
  findAll: jest.fn(),
  findAllByItemId: jest.fn(),
});

describe('ItemsController', () => {
  let controller: ItemsController;
  let itemService;
  let historyService;
  let items: Item[] = [];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemService,
          useFactory: itemServiceMock,
        },
        { provide: HistoryService, useFactory: historyServiceMock },
      ],
    }).compile();

    controller = await module.get(ItemsController);
    itemService = await module.get(ItemService);
    historyService = await module.get(HistoryService);

    items = [
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
        history: [],
      },
    ];
  });

  // TODO: Fix this
  // describe('When calling findAll function', () => {
  //   it('should return an array of items', async () => {
  //     const expected = items;

  //     const mockData = expected.map((prop) => ({ ...prop }));
  //     itemService.findAll.mockResolvedValue(mockData);

  //     const actual = await controller.findAll({} as PaginationRequestDto);

  //     expect(actual[0]).toEqual(expected[0]);
  //   });
  // });

  describe('When calling findById function', () => {
    describe('and the itemId is valid', () => {
      it('should return the specified item', async () => {
        const expected = items[0];

        itemService.findById.mockResolvedValue({ ...expected });

        const actual = await controller.findById('123');

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('When calling create function', () => {
    it('should return the specified item', async () => {
      const expected = items[0];

      itemService.create.mockResolvedValue({ ...expected });

      const actual = await controller.create({
        address: '',
        tokenId: 1,
        collectionAddress: '',
        name: '',
        description: '',
        royalty: 1,
        status: 1,
        image: {} as ImageRequestDto,
        wei: '1',
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('When calling findAllHistory function', () => {
    it('should return history array', async () => {
      const expected = items;

      historyService.findAll.mockResolvedValue(expected);

      const actual = await controller.findAllHistory();

      expect(actual).toEqual(expected);
    });
  });
  describe('When calling findAllHistory function', () => {
    it('should return history array with specific item', async () => {
      const expected = items[0];

      historyService.findAllByItemId.mockResolvedValue(expected);

      const actual = await controller.findAllByItemId(expected.itemId);

      expect(actual).toEqual(expected);
    });
  });
});
