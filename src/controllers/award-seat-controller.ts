import express from 'express';
import { Op, WhereOptions } from 'sequelize';
import { omitBy, isNil } from 'lodash-es';

import AwardSeat from '../models/award-seat.js';

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

class AwardSeatController {
  public path = '/award-seats';
  public router = express.Router();

  private parseRequest(queryObj: AwardSeatQuery): WhereOptions<AwardSeat> {
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

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.get);
  }

  get = async (request: express.Request, response: express.Response) => {
    try {
      const result = await AwardSeat.findAll({
        where: this.parseRequest(request.query),
        order: [['date', 'ASC']],
        limit: 1000,
      });
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  };

}

export default AwardSeatController;
