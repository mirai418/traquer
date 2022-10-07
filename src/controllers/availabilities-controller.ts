import express from 'express';

import Controller from './controller-interface.js';
import Availability from '../models/availability.js';

class AvailabilityController implements Controller {
  public path = '/availabilities';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.get);
  }

  public async get(request: express.Request, response: express.Response) {
    try {
      const result = await Availability.findAll();
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  }

}

export default AvailabilityController;
