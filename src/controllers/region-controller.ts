import express from 'express';

import Controller from './controller-interface.js';
import Region from '../models/region.js';

class RegionController implements Controller {
  public path = '/regions';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.get);
  }

  get = async (request: express.Request, response: express.Response) => {
    try {
      const result = await Region.findAll();
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  };

}

export default RegionController;
