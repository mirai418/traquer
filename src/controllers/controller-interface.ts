import express, { Request, Response, NextFunction } from 'express';

interface Controller {
  path: string,
  router: express.Router,
  initializeRoutes(): void,
  get?(request: Request, response: Response, next: NextFunction): Promise<void>,
  post?(request: Request, response: Response, next: NextFunction): Promise<void>,
  patch?(request: Request, response: Response, next: NextFunction): Promise<void>,
  delete?(request: Request, response: Response, next: NextFunction): Promise<void>,
}

export default Controller;
