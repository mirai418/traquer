import express, { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import Controller from './controller-interface.js';
import Subscription from '../models/subscription.js';
import User from '../models/user.js';
import { authMiddleware, RequestWithUser } from '../middlewares/auth-middleware.js';
import { clone } from 'lodash-es';

const includeUserObj = {
  model: User,
  as: 'user',
};

class SubscriptionController implements Controller {
  public path = '/subscriptions';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware(), this.get);
    this.router.post(this.path, authMiddleware(), this.post);
    this.router.patch(this.path + '/:id', authMiddleware(), this.patch);
    this.router.delete(this.path + '/:id', authMiddleware(), this.delete);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const doInclude = (request.query.include as string || '').split(',').includes('user');
      delete request.query.include;
      if (!user.isAdmin && request.query.userId && parseInt(request.query.userId as string) !== user.id) {
        response.json([]);
      } else  {
        const where = clone(request.query);
        if (!user.isAdmin) {
          where.userId = (request as RequestWithUser).user.id.toString();
        }
        const result = await Subscription.findAll({
          include: doInclude ? includeUserObj : undefined,
          where: where,
        });
        response.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  public async post(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      if (!user.isAdmin && (request.body.userId !== user.id)) {
        throw new createHttpError.Forbidden('You cannot create Subscriptions for other users.');
      } else {
        const result = await Subscription.create(request.body);
        response.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  public async patch(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const subscription = await Subscription.findByPk(request.params.id);
      if (!user.isAdmin && (!subscription || subscription.userId !== user.id)) {
        throw new createHttpError.Forbidden('You cannot update Subscriptions for other users.');
      } else if (!subscription) {
        throw new createHttpError.NotFound('Subscription not found.');
      } else if (!user.isAdmin && request.body.userId) {
        throw new createHttpError.Forbidden('You cannot update the ownership of Subscriptions.');
      } else {
        await subscription.update(request.body);
        response.json(subscription);
      }
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const subscription = await Subscription.findByPk(request.params.id);
      if (!user.isAdmin && (!subscription || subscription.userId !== user.id)) {
        throw new createHttpError.Forbidden('You cannot delete Subscriptions for other users.');
      } else if (!subscription) {
        throw new createHttpError.NotFound('Subscription not found.');
      } else {
        await subscription.destroy();
        response.json({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

}

export default SubscriptionController;
