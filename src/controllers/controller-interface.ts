import express, { Request, Response, NextFunction } from 'express';

interface Controller {
  path: string,
  router: express.Router,
  initializeRoutes(): void,
  get?(request: Request, response: Response, next: NextFunction): void,
  post?(request: Request, response: Response, next: NextFunction): void,
  patch?(request: Request, response: Response, next: NextFunction): void,
  delete?(request: Request, response: Response, next: NextFunction): void,
}

export default Controller;
