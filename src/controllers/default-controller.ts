import express, { Request, Response } from 'express';

import Controller from './controller-interface.js';

class DefaultController implements Controller {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.get);
  }

  public async get(request: Request, response: Response) {
    response.json({
      message: `Hello World! The time now is ${new Date()}`,
    });
  }

}

export default DefaultController;
