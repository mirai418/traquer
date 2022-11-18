import express, { Request, Response, NextFunction } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { omitBy, isNil } from 'lodash-es';

import Controller from './controller-interface.js';
import AwardSeat from '../models/award-seat.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

interface AwardSeatQuery {
  id?: string,
  date?: string,
  routeFrom?: string,
  routeTo?: string,
  regionId?: string,
  statusId?: string,
  seatId?: string,
  availabilityId?: string,
  dateFrom?: string,
  dateTo?: string,
}

function splitOrUndefined(str: string | undefined): string[] | undefined {
  return str ? str.split(',') : undefined;
}

function parseRequest(queryObj: AwardSeatQuery): WhereOptions<AwardSeat> {
  const whereOptions: WhereOptions<AwardSeat> = omitBy({
    id: splitOrUndefined(queryObj.id),
    routeFrom: splitOrUndefined(queryObj.routeFrom),
    routeTo: splitOrUndefined(queryObj.routeTo),
    regionId: splitOrUndefined(queryObj.regionId),
    statusId: splitOrUndefined(queryObj.statusId),
    seatId: splitOrUndefined(queryObj.seatId),
    availabilityId: splitOrUndefined(queryObj.availabilityId),
    isLatest: true,
  }, isNil);
  if (queryObj.date) {
    whereOptions.date = splitOrUndefined(queryObj.date);
  } else if (queryObj.dateFrom && queryObj.dateTo) {
    whereOptions.date = {
      [Op.between]: [new Date(queryObj.dateFrom || ''), new Date(queryObj.dateTo || '')],
    };
  } else {
    whereOptions.date = {
      [Op.gte]: new Date(),
    };
  }
  return whereOptions;
}

class AwardSeatController implements Controller {
  public path = '/award-seats';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware(), this.get);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await AwardSeat.findAll({
        where: parseRequest(request.query),
        order: [['date', 'ASC']],
        limit: 1000,
      });
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default AwardSeatController;
