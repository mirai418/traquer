import express, { NextFunction, Request, Response } from 'express';

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

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Availability.findAll();
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default AvailabilityController;
