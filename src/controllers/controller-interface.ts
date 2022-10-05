import express from 'express';

interface Controller {
  path: string,
  router: express.Router,
  intializeRoutes(): void,
  get?(rquest: express.Request, response: express.Response): void,
  post?(rquest: express.Request, response: express.Response): void,
  patch?(rquest: express.Request, response: express.Response): void,
  delete?(rquest: express.Request, response: express.Response): void,
}

export default Controller;
