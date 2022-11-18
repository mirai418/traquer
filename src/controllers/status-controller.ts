import express, { NextFunction, Request, Response } from 'express';

import Controller from './controller-interface.js';
import Status from '../models/status.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

class StatusController implements Controller {
  public path = '/statuses';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware(), this.get);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Status.findAll();
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default StatusController;
