import express from 'express';

import Controller from './controller-interface.js';
import Subscription from '../models/subscription.js';

class SubscriptionController implements Controller {
  public path = '/subscriptions';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.get);
    this.router.post(this.path, this.post);
  }

  get = async (request: express.Request, response: express.Response) => {
    try {
      const result = await Subscription.findAll();
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  };

  post = async (request: express.Request, response: express.Response) => {
    try {
      const result = await Subscription.create(request.body);
      response.json(result);
    } catch (error: any) {
      console.log(error.stack);
      response.status(502).json({
        message: 'something went wrong',
      });
    }
  };

}

export default SubscriptionController;
