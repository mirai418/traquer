import express, { NextFunction, Request, Response } from 'express';

import Controller from './controller-interface.js';
import Seat from '../models/seat.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

class SeatController implements Controller {
  public path = '/seats';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware(), this.get);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await Seat.findAll();
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default SeatController;
