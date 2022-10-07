import express from 'express';

interface Controller {
  path: string,
  router: express.Router,
  initializeRoutes(): void,
  get?(request: express.Request, response: express.Response): void,
  post?(request: express.Request, response: express.Response): void,
  patch?(request: express.Request, response: express.Response): void,
  delete?(request: express.Request, response: express.Response): void,
}

export default Controller;
