import express, { NextFunction, Request, Response } from 'express';

import Controller from './controller-interface.js';
import Subscription from '../models/subscription.js';

class SubscriptionController implements Controller {
  public path = '/subscriptions';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.get);
    this.router.post(this.path, this.post);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Subscription.findAll();
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async post(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Subscription.create(request.body);
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default SubscriptionController;
