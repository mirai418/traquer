import express, { Request, Response, NextFunction } from 'express';

import Controller from './controller-interface.js';
import User from '../models/user.js';
import { authMiddleware, RequestWithUser } from '../middlewares/auth-middleware.js';
import Subscription from '../models/subscription.js';
import { clone } from 'lodash-es';
import createHttpError from 'http-errors';

const includeSubscriptionsObj = {
  model: Subscription,
  as: 'subscriptions',
};

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware(), this.get);
    this.router.post(this.path, authMiddleware({isAdmin: true}), this.post);
    this.router.patch(this.path + '/:id', authMiddleware(), this.patch);
    this.router.delete(this.path + '/:id', authMiddleware(), this.delete);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const doInclude = (request.query.include as string || '').split(',').includes('subscriptions');
      delete request.query.include;
      if (!user.isAdmin && request.query.id && parseInt(request.query.id as string) !== user.id) {
        response.json([]);
      } else  {
        const where = clone(request.query);
        if (!user.isAdmin) {
          where.id = (request as RequestWithUser).user.id.toString();
        }
        const result = await User.findAll({
          include: doInclude ? includeSubscriptionsObj : undefined,
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
      const result = await User.create(request.body);
      response.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async patch(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const userToUpdate = await User.findByPk(request.params.id);
      if (!user.isAdmin && (!userToUpdate || (user.id !== userToUpdate.id))) {
        throw new createHttpError.Forbidden('You cannot update other Users.');
      } else if (!userToUpdate) {
        throw new createHttpError.NotFound('User not found.');
      } else if (!user.isAdmin) {
        await userToUpdate.updateRestricted(request.body);
        response.json(userToUpdate);
      } else {
        await userToUpdate.update(request.body);
        response.json(userToUpdate);
      }
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const userToUpdate = await User.findByPk(request.params.id);
      if (!user.isAdmin && (!userToUpdate || (user.id !== userToUpdate.id))) {
        throw new createHttpError.Forbidden('You cannot delete other Users.');
      } else if (!userToUpdate) {
        throw new createHttpError.NotFound('User not found.');
      } else {
        await userToUpdate.destroy();
        response.json({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

}

export default UserController;
