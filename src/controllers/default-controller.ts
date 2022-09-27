import express from 'express';

class DefaultController {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.get);
  }

  get = (request: express.Request, response: express.Response) => {
    response.json({
      message: `Hello World! The time now is ${new Date()}`,
    });
  };
}

export default DefaultController;
