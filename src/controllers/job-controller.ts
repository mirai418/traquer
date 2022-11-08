import express, { Request, Response } from 'express';
import { isUndefined } from 'lodash-es';

import Controller from './controller-interface.js';
import refreshData from '../jobs/refresh-data.js';
import checkSubscriptions from '../jobs/check-subscriptions.js';

class JobController implements Controller {
  public path = '/jobs';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.post);
  }

  public async post(request: Request, response: Response) {
    try {
      let result;
      if (request.body.name === 'refresh-data') {
        result = await refreshData();
      } else if (request.body.name === 'check-subscriptions') {
        result = await checkSubscriptions();
      }
      response.json({
        executed: !isUndefined(result),
        success: true,
        result: result,
      });
    } catch (error) {
      response.json({
        success: false,
      });
    }
  }

}

export default JobController;
