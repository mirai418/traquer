import express from 'express';
import { isUndefined } from 'lodash-es';

import Controller from './controller-interface.js';
import refreshData from '../jobs/refresh-data.js';
import checkSubscriptions from '../jobs/check-subscriptions.js';

class JobController implements Controller {
  public path = '/jobs';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.post);
  }

  post = async (request: express.Request, response: express.Response) => {
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
    } catch (error: any) {
      console.log(error.stack);
      response.json({
        success: false,
      });
    }
  };

}

export default JobController;
