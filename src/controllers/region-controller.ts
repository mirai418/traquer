import express, { NextFunction, Request, Response } from 'express';

import Controller from './controller-interface.js';
import Region from '../models/region.js';

class RegionController implements Controller {
  public path = '/regions';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.get);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Region.findAll();
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default RegionController;
