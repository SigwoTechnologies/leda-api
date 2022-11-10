import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { constants } from '../constants';

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(req: any, _: any, next: NextFunction) {
    const { pagination } = constants;
    req.query.limit = +req.query.limit || pagination.defaultLimit;
    req.query.page = +req.query.page || pagination.defaultPage;
    req.query.limit =
      req.query.limit > pagination.defaultMaxLimit ? pagination.defaultLimit : req.query.limit;
    req.query.skip = (req.query.page - 1) * req.query.limit;
    req.query.search = req.query.search || '';
    next();
  }
}
