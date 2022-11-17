import express, { NextFunction, Request, Response } from 'express';

import Controller from './controller-interface.js';
import Subscription from '../models/subscription.js';
import User from '../models/user.js';
import { authMiddleware, RequestWithUser } from '../middlewares/auth-middleware.js';
import { ValidationError } from 'sequelize';
import { ForbiddenError, NotFoundError, NotUpdatableFieldError } from '../config/errors.js';
import { clone } from 'lodash-es';

const includeUserObj = {
  model: User,
  as: 'user',
};

function handleError(error: unknown, response: Response, next: NextFunction) {
  if (error instanceof NotFoundError) {
    response.status(404).json({
      message: 'Not Found. Could not find this resource.',
    });
  } else if (error instanceof ForbiddenError) {
    response.status(403).json({
      message: 'Forbidden. You do not have the rights to perform this action.',
    });
  } else if (error instanceof NotUpdatableFieldError) {
    response.status(403).json({
      message: 'Forbidden. This field is not assignable or updatable (by you).',
    });
  } else if (error instanceof ValidationError) {
    response.status(401).json({
      message: error.message,
    });
  } else {
    next(error);
  }
}

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
      handleError(error, response, next);
    }
  }

  public async post(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      if (!user.isAdmin && (request.body.userId !== user.id)) {
        throw new NotUpdatableFieldError();
      } else {
        const result = await Subscription.create(request.body);
        response.json(result);
      }
    } catch (error) {
      handleError(error, response, next);
    }
  }

  public async patch(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const subscription = await Subscription.findByPk(request.params.id);
      console.log(user.id, subscription?.userId);
      if (!subscription) {
        throw new NotFoundError();
      } else if (!user.isAdmin && (subscription.userId !== user.id)) {
        throw new ForbiddenError();
      } else if (!user.isAdmin && request.body.userId) {
        throw new NotUpdatableFieldError();
      } else {
        await subscription.update(request.body);
        response.json(subscription);
      }
    } catch (error) {
      handleError(error, response, next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      const subscription = await Subscription.findByPk(request.params.id);
      if (!subscription) {
        throw new NotFoundError();
      } else if (!user.isAdmin && (subscription.userId !== user.id)) {
        throw new ForbiddenError();
      } else {
        await subscription.destroy();
        response.json({
          success: true,
        });
      }
    } catch (error) {
      handleError(error, response, next);
    }
  }

}

export default SubscriptionController;
