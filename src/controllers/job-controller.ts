import express from 'express';
import refreshData from '../jobs/refresh-data.js';
import checkSubscriptions from '../jobs/check-subscriptions.js';

class JobController {
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
      if (request.body.name === 'refresh-data') {
        await refreshData();
        response.json({
          executed: true,
          success: true,
        });
      } else if (request.body.name === 'check-subscriptions') {
        await checkSubscriptions();
        response.json({
          executed: true,
          success: true,
        });
      } else {
        response.json({
          executed: false,
        });
      }
    } catch (error: any) {
      console.log(error.stack);
      response.json({
        success: false,
      });
    }
  };

}

export default JobController;
