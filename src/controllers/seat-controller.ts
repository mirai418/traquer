import express from 'express';

import Seat from '../models/seat.js';

class SeatController {
  public path = '/seats';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.get);
  }

  get = async (request: express.Request, response: express.Response) => {
    try {
      const result = await Seat.findAll();
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  };

}

export default SeatController;
